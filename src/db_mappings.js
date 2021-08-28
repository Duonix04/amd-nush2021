// This file is not actually used, but is what we would've used if we were able to modify our code to use a mongoDB instance.
const mongoose = require('mongoose');
const MONGO_URI = "mongodb+srv://default_user:i91mlQAkYyqgY3Hm@main.eyvae.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const vegSchema = new mongoose.Schema({
    id: String,
    vegName: String,
    quantity: Number,
    createdAt: Date,
    supplierId: String,
    imgLink: String,
});


const reqSchema = new mongoose.Schema({
    id: String,
    vegName: String,
    quantity: Number,
    createdAt: Date,
    type: Number,
    // 0 for community shop, 1 for normal (vegetable-list) shop
    buyerId: String,
    supplierId: String,
    vegId: String,
    // NEW: vegId stores the ID of the vegetable item to update after the request has been fulfilled.
    // It is filled in when a normal shop request is made, or when an offer has been sent to an community shop request.
    status: Number,
    // STATUS FOR COMMUNITY SHOP: 3 for 'request sent to shop', 2 for 'someone offered', 1 for "requester accepted", 0 for fulfilled
    // If 'request rejected/failed to fulfill', return status to 3 (and punish supplier if failed to fulfill)
    // STATUS FOR NORMAL SHOP: 3 for 'request sent to supplier', 2 for 'request rejected/failed to fulfill', 1 for accepted, 0 for fulfilled
    fulfillmentStatus: Number,
});

const userSchema = new mongoose.Schema({
    id: String,
    name: String,
    locationX: Number,
    locationY: Number,
    contact: String,
    passwdHash: Number,
    gPoints: Number,
    gCoins: Number,
});

export const Veg = mongoose.model('Veg', vegSchema);
export const Req = mongoose.model('Req', reqSchema);
export const User = mongoose.model('User', userSchema);

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


function hashCode(str) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

async function connectToDB() {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}


async function addgPoints(user, amt) {
    await connectToDB();
    user.gPoints += amt;
    await user.save();
}


async function addgPointsById(userid, amt) {
    await connectToDB();
    const list = await User.find({
        id: userid,
    });
    await addgPoints(list[0]);
}




async function addgCoins(user, amt) {
    await connectToDB();
    user.gCoins += amt;
    await user.save();
}


async function addgCoinsById(userid, amt) {
    await connectToDB();
    const list = await User.find({
        id: userid,
    });
    await addgCoins(list[0]);
}

// Add an user to the database.
export async function addUser(name, locationX, locationY, contact, passwd) {
    const newId = makeid(8);
    const saltedPassword = passwd + newId;
    const newUser = new User({
        id: newId,
        name: name,
        locationX: locationX,
        locationY: locationY,
        contact: contact,
        passwdHash: hashCode(saltedPassword),
        gPoints: 0,
        gCoins: 0,
    });
    await connectToDB();
    let duplicate = await User.find({
        name: name,
    }).exec();
    if (duplicate.length > 0) {
        throw new Error('User already exists');
    }
    else {
        await newUser.save();
        return newUser;
    }
}

export async function loginCheck(username, passwd) {
    await connectToDB();
    const userList = await User.find({
        name: username,
    });
    if (userList.length === 0) {
        throw new Error('User not found.');
    }
    const user = userList[0];
    if (user.passwdHash !== hashCode(passwd + user.id)) {
        throw new Error('Password is not correct.');
    }
    else return user;
}

export async function addVeg(vegName, quantity, supplier, imgLink) {
    const newVeg = new Veg({
        id: makeid(8),
        vegName: vegName,
        quantity: quantity,
        createdAt: new Date(),
        supplierId: supplier.id,
        imgLink: imgLink,
    });
    await connectToDB();
    await addgPoints(supplier, 400);
    await addgCoins(supplier, 1);
    await newVeg.save();

    return newVeg;
}

export async function makeCommunityShopReq(vegName, quantity, buyer) {
    if (buyer.gCoins < 1) {
        throw new Error('Buyer doesnt have enough gCoins to make a request');
    }
    const newReq = new Req({
        id: makeid(8),
        vegName: vegName,
        quantity: quantity,
        createdAt: new Date(),
        type: 0,
        buyerId: buyer.id,
        supplierId: null,
        vegId: null,
        status: 3,
        fulfillmentStatus: 0,
    });
    await connectToDB();
    let buyerReqs = await User.find({
        buyerId: buyer.id,
        status: { $gt: 0 },
    });
    if (buyerReqs.length >= 15) {
        throw new Error('Buyer has too many active requests. We limit each user to 15 total buy requests.');
    }
    else {
        await newReq.save();
        await addgCoins(buyer, -1);
        return newReq;
    }
}



export async function makeCommunityShopOffer(req, supplier) {
    if (req.type !== 0) {
        throw new Error('This request is not a community shop request');
    }
    else if (req.status !== 3) {
        throw new Error('This request is not up for offers');
    }
    else {

        await connectToDB();
        let vegList = await Veg.find({
            vegName: req.vegName,
            supplierId: supplier.id,
        });
        if (vegList.length === 0 || vegList[0].quantity < req.quantity) {
            throw new Error('You dont have enough vegetable to make an offer');
        }
        vegList[0].quantity -= req.quantity;
        await vegList[0].save();

        req.status = 2;
        req.supplierId = supplier.id;
        req.vegId = vegList[0].id;
        await req.save();
    }
}

export async function resolveCommunityShopOffer(req, accept = 1) {
    if (req.type !== 0) {
        throw new Error('This request is not a community shop request');
    }
    else if (req.status !== 2) {
        throw new Error('This request does not have an offer to resolve');
    }
    else {

        await connectToDB();
        if (accept) {
            req.status = 1;
        }
        else {
            let vegList = await Veg.find({
                id: req.vegId
            });
            vegList[0].quantity += req.quantity;
            await vegList[0].save();
            req.status = 3;
            req.supplierId = null;
            req.vegId = null;
        }
        await req.save();
    }
}

export async function markFulfilled(req, isBuyer = 0) {

    await connectToDB();
    if (req.status !== 1) {
        throw new Error('This request is not at the fulfillment stage');
    }
    else {
        if (isBuyer) {
            if (req.fulfillmentStatus === 1 || req.fulfillmentStatus === 3) {
                throw new Error('You have already marked fulfillment for this request');
            }
            else {
                req.fulfillmentStatus += 1;
                if (req.fulfillmentStatus === 3) {
                    req.status = 0;
                    await addgCoinsById(req.supplierId, 1);
                    await addgPointsById(req.supplierId, 50);
                    await addgPointsById(req.buyerId, 50);
                }
            }
        }
        else {
            if (req.fulfillmentStatus === 2 || req.fulfillmentStatus === 3) {
                throw new Error('You have already marked fulfillment for this request');
            }
            else {
                req.fulfillmentStatus += 2;
                if (req.fulfillmentStatus === 3) {
                    req.status = 0;
                    await addgCoinsById(req.supplierId, 1);
                    await addgPointsById(req.supplierId, 50);
                    await addgPointsById(req.buyerId, 50);
                }
            }
        }
        await req.save();
    }
}

export async function cancelFulfillment(req, report = 0) {
    if (req.status !== 1) {
        throw new Error('This request is not at the fulfillment stage');
    }
    else {

        await connectToDB();
        if (report) {
            await addgCoinsById(req.supplierId, -5);
        }


        if (req.type === 0) {
            req.status = 3;
            req.supplierId = null;
            req.vegId = null;
        }
        else {
            req.status = 2;
        }
        await req.save();
    }
}



export async function makeNormalShopReq(veg, quantity, buyer) {

    if (buyer.gCoins < 1) {
        throw new Error('Buyer doesnt have enough gCoins to make a request');
    }
    const newReq = new Req({
        id: makeid(8),
        vegName: veg.vegName,
        quantity: quantity,
        createdAt: new Date(),
        type: 1,
        buyerId: buyer.id,
        supplierId: veg.supplierId,
        vegId: veg.id,
        status: 3,
        fulfillmentStatus: 0,
    });
    await connectToDB();
    let buyerReqs = await User.find({
        buyerId: buyer.id,
        status: { $gt: 0 },
    });
    if (buyerReqs.length >= 15) {
        throw new Error('User has too many active requests. We limit each user to 15 total requests.');
    }
    else {
        await newReq.save();
        await (addgCoins(buyer, -1));
        return newReq;
    }
}

export async function resolveNormalShopReq(req, accept = 1) {
    if (req.type !== 1) {
        throw new Error('This request is not a normal shop request');
    }
    else if (req.status !== 3) {
        throw new Error('This request cannot be resolved now');
    }
    else {
        await connectToDB();
        if (accept) {
            const vegList = await Veg.find({
                id: req.vegId,
            });
            if (vegList.length === 0 || vegList[0].quantity < req.quantity) {
                throw new Error('You dont have enough vegetable to make an offer');
            }
            vegList[0].quantity -= req.quantity;
            await vegList[0].save();
            req.status = 1;
        }
        else {
            req.status = 2;
            await (addgCoinsById(req.buyerId, 1));
        }
        await req.save();
    }
}



async function main() {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('W');
}

main().catch(err => console.log(err));