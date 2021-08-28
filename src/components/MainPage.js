import { UserNavBar } from './NavBar';
import Button from "react-bootstrap/Button";
import { Container } from "react-bootstrap";
import * as consts from './constants';
import '../App.css'

export default function MainPage(props) {
  return <div>
    <UserNavBar switchHandler={props.switchHandler} curUser={props.curUser} setUser={props.setUser} />
    <div id="main-page-container">
      <Container>
        <div class="large-text green-text">Think globally, plant locally</div>
        <section id="container-description">
          <div><strong><span class="green-text">AMD-Green</span></strong> is an app to help people exchange home-grown vegetables in a carbon-efficient way</div>
          <div>Our goal is to help combat global warming by encouraging neighbourhoods to grow and buy fresh local vegetables </div>
        </section>
        <div class="quote-block">
          <div class="quote">"We have a single mission: to protect and hand on the planet to the next generation"</div>
          <div class="quote-author">— Francois Hollande, Former Franch President</div>
        </div>
        <Button variant="success" onClick={() => props.switchHandler(consts.SCREEN_LOGIN)}>
          Login and Join Us!
        </Button>
      </Container>
    </div>
    <div id="our-story">
      <Container style={{ textAlign: "center", }}>
        <div class="large-text"
          style={{
            marginTop: "70px",
            marginBottom: "70px"
          }}>Our story</div>
        <article>
          <h1 class="paragraph-title">Breaking point<br /><hr /></h1>
          The year is 2021, and global warming is now more real than ever.
          Mean global temperature and level of CO2 in the atmosphere is the highest in thousands of years.
          Collapsed West Antarctic ice sheet are irreversible.
          At this point, we either go green or go extinct, and planting is currently one of the most practical
          weapons we can use to combat global warming. <br />
          <img src="https://images-ext-1.discordapp.net/external/FGIGNmeudbKURo0_oNpCRseCrc4utIHvFisBWXUiSuY/https/www.greenqueen.com.hk/wp-content/uploads/2021/03/Worlds-Biggest-Banks-Fund-Fossil-Fuels-With-Trillion-Dollar-Finance-New-Report-Reveals.jpg?width=750&height=563"
            alt="fossil-fuel" />
          <img src="https://media.discordapp.net/attachments/872462486354407437/881047000638980126/iStock-157313230-e1516766982207.png"
            alt="exhaust-fumes" />
        </article>
        <article>
          <h1 class="paragraph-title">Vertical planting<br /><hr /></h1>
          In order to grow more trees and vegetables, residents of large, crowded cities invented many innovative
          solutions to create more planting space. One of them is vertical farming, which means to grow upwards instead
          of outwards. As this farming method allows citizens to obtain sustainable source of fresh vegetable and
          clean air, more and more families are now adapting to this new lifestyle. Planting
          vegetable for food is surely eco-friendly, but what if we take it to another level? What if, we design
          an ecosystem based on growing own vegetables to help a community share and exchange vegetable, and
          also greatly reduces CO2 in the process ? That is what motivates us to develop AMD-Green. <br />
          <img src="https://media.discordapp.net/attachments/872462486354407437/881047778413928508/thap-rau-huu-co-243-2.png?width=563&height=563"
            alt="tower1" />
          <img src="https://media.discordapp.net/attachments/872462486354407437/881048082752622622/20160414153713-image010.png"
            alt="tower2" />
        </article>
      </Container>
    </div>
  </div >
}