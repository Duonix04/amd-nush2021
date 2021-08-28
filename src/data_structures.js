export function VegObj(obj) {
  this.id = obj.id;
  this.vegName = obj.vegName;
  this.quantity = obj.quantity;
  this.createdAt = obj.createdAt;
  this.supplierId = obj.supplierId;
  this.imgLink = obj.imgLink;
};


export function ReqObj(obj) {
  this.id = obj.id; //String,
  this.vegName = obj.vegName; //String,
  this.quantity = obj.quantity; //Number,
  this.createdAt = obj.createdAt; //Date,
  this.type = obj.type; //Number,
  // 0 for community shop, 1 for normal (vegetable-list) shop
  this.buyerId = obj.buyerId; //String,
  this.supplierId = obj.supplierId; //String,
  this.vegId = obj.vegId;
  // this.NEW = obj.NEW; //vegId stores the ID of the vegetable item to update after the request has been fulfilled.
  // It is filled in when a normal shop request is made, or when an offer has been sent to an community shop request.
  this.status = obj.status;
  // this.STATUS FOR COMMUNITY SHOP = obj.STATUS FOR COMMUNITY SHOP; //3 for 'request sent to shop', 2 for 'someone offered', 1 for "requester accepted", 0 for fulfilled
  // If 'request rejected/failed to fulfill', return status to 3 (and punish supplier if failed to fulfill)
  // this.STATUS FOR NORMAL SHOP = obj.STATUS FOR NORMAL SHOP; //3 for 'request sent to supplier', 2 for 'request rejected/failed to fulfill', 1 for accepted, 0 for fulfilled
  this.fulfillmentStatus = obj.fulfillmentStatus;
};

function UserObj(obj) {
  this.id = obj.id; //String,
  this.name = obj.name; //String,
  this.locationX = obj.locationX; //Number,
  this.locationY = obj.locationY; //Number,
  this.contact = obj.contact; //String,
  this.passwd = obj.passwd; //Number,
  this.gPoints = obj.gPoints; //Number,
  this.gCoins = obj.gCoins; //Number,
};

export const User = [];
export const Req = [];
export const Veg = [];


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

async function importDBFromFile() {
  //   await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}


function addgPoints(user, amt) {
  user.gPoints += amt;
}


function addgPointsById(userid, amt) {
  const res = User.find((obj) => { return (obj.id === userid) });
  addgPoints(res);
}




function addgCoins(user, amt) {
  user.gCoins += amt;
}


function addgCoinsById(userid, amt) {
  const res = User.find((obj) => { return (obj.id === userid) });
  addgCoins(res);
}

// Add an user to the database.
export function addUser(name, locationX, locationY, contact, passwd) {
  const newId = makeid(8);
  //   const saltedPassword = passwd + newId;
  const newUser = new UserObj({
    id: newId,
    name: name,
    locationX: locationX,
    locationY: locationY,
    contact: contact,
    passwd: passwd,
    gPoints: 0,
    gCoins: 0,
  });

  let duplicate = User.find((obj) => {
    return (obj.name === name);
  });
  if (duplicate !== undefined) {
    throw new Error('User already exists');
  }
  else {
    User.push(newUser);
    return newUser;
  }
}

export function loginCheck(username, passwd) {

  const user = User.find((obj) => {
    return (obj.name === username);
  });
  if (user === undefined) {
    throw new Error('User not found.');
  }
  if (user.passwd !== passwd) {
    throw new Error('Password is not correct.');
  }
  else return user;
}

export function addVeg(vegName, quantity, supplier, imgLink) {
  const newVeg = new VegObj({
    id: makeid(8),
    vegName: vegName,
    quantity: quantity,
    createdAt: new Date(),
    supplierId: supplier.id,
    imgLink: imgLink,
  });

  addgPoints(supplier, 400);
  addgCoins(supplier, 1);
  Veg.push(newVeg);
  return newVeg;
}

export function makeCommunityShopReq(vegName, quantity, buyer) {
  if (buyer.gCoins < 1) {
    throw new Error('Buyer doesnt have enough gCoins to make a request');
  }
  const newReq = new ReqObj({
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

  let buyerReqs = Req.filter((obj) => {
    return (obj.buyerId === buyer.id && obj.status > 0);
  });
  if (buyerReqs.length >= 15) {
    throw new Error('Buyer has too many active requests. We limit each user to 15 total buy requests.');
  }
  else {
    Req.push(newReq);
    addgCoins(buyer, -1);
    return newReq;
  }
}



export function makeCommunityShopOffer(req, supplier) {
  if (req.type !== 0) {
    throw new Error('This request is not a community shop request');
  }
  else if (req.status !== 3) {
    throw new Error('This request is not up for offers');
  }
  else {
    let target = Veg.filter((obj) => {
      return (obj.vegName === req.vegName && obj.supplierId === supplier.id);
    });
    if (target === undefined || target.quantity < req.quantity) {
      throw new Error('You dont have enough vegetable to make an offer');
    }
    target.quantity -= req.quantity;

    req.status = 2;
    req.supplierId = supplier.id;
    req.vegId = target.id;
  }
}

export function resolveCommunityShopOffer(req, accept = 1) {
  if (req.type !== 0) {
    throw new Error('This request is not a community shop request');
  }
  else if (req.status !== 2) {
    throw new Error('This request does not have an offer to resolve');
  }
  else {
    if (accept) {
      req.status = 1;
    }
    else {
      let target = Veg.find((obj) => {
        return (obj.id === req.vegId);
      });
      target.quantity += req.quantity;
      req.status = 3;
      req.supplierId = null;
      req.vegId = null;
    }
  }
}

export function markFulfilled(req, isBuyer = 0) {
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
          addgCoinsById(req.supplierId, 1);
          addgPointsById(req.supplierId, 50);
          addgPointsById(req.buyerId, 50);
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
          addgCoinsById(req.supplierId, 1);
          addgPointsById(req.supplierId, 50);
          addgPointsById(req.buyerId, 50);
        }
      }
    }
  }
}

export function cancelFulfillment(req, report = 0) {
  if (req.status !== 1) {
    throw new Error('This request is not at the fulfillment stage');
  }
  else {

    if (report) {
      addgCoinsById(req.supplierId, -5);
    }


    if (req.type === 0) {
      req.status = 3;
      req.supplierId = null;
      req.vegId = null;
    }
    else {
      req.status = 2;
    }
    req.save();
  }
}



export function makeNormalShopReq(veg, quantity, buyer) {

  if (buyer.gCoins < 1) {
    throw new Error('Buyer doesnt have enough gCoins to make a request');
  }
  const newReq = new ReqObj({
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

  let buyerReqs = Req.filter((obj) => {
    return (obj.buyerId === buyer.id && obj.status > 0);
  });
  if (buyerReqs.length >= 15) {
    throw new Error('Buyer has too many active requests. We limit each user to 15 total buy requests.');
  }
  else {
    Req.push(newReq);
    addgCoins(buyer, -1);
    return newReq;
  }
}

export function resolveNormalShopReq(req, accept = 1) {
  if (req.type !== 1) {
    throw new Error('This request is not a normal shop request');
  }
  else if (req.status !== 3) {
    throw new Error('This request cannot be resolved now');
  }
  else {

    if (accept) {
      let target = Veg.filter((obj) => {
        return (obj.vegName === req.vegName && obj.supplierId === req.supplierId);
      });
      if (target === undefined || target.quantity < req.quantity) {
        throw new Error('You dont have enough vegetable to make an offer');
      }
      target.quantity -= req.quantity;
      req.status = 1;
    }
    else {
      req.status = 2;
      addgCoinsById(req.buyerId, 1);
    }
  }
}

