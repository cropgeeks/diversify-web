<template>
  <div>
    <!-- The background image -->
    <div class="bg-img" :style="{ backgroundImage: 'url(' + require('@/assets/background.jpg') + ')' }">
      <!-- The semi-transparent overlay -->
      <div class="overlay"></div>
      <!-- The scroll indicator -->
      <div class="mouse-icon">
        <div class="wheel"></div>
      </div>
    </div>
    <!-- The text -->
    <div class="home-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-md-10 offset-md-1">
            <div class="home-content">
              <b-img fluid :src="require('@/assets/diversiplotter.svg')" id="diversiplotter-logo" />
              <h1 class="white-text">Welcome to DIVERSiplotter</h1>
              <p class="white-text">A tool for Field Data Visualization based on the DIVERSify intercropping trials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-container class="home-container" style="margin-bottom: 200px;">
      <h1>DIVERSify</h1>
      <p>The <a href="https://www.plant-teams.eu/">DIVERSify project</a> aims to <b>optimise the performance of crop species mixtures or 'plant teams'</b> to improve yield stability, reduce pest and disease damage, and enhance stress resilience in agricultural systems. It focuses on improving the productivity and sustainability of European agriculture using an approach that has global relevance, <b>learning from the experience of international researchers and stakeholders</b>.</p>

      <b-row class="mt-3 pt-3 d-flex align-items-center">
        <b-col cols=3 md=1>
          <b-img fluid :src="require('@/assets/eu.svg')"/>
        </b-col>
        <b-col cols=9 md=11>The project has received funding from the European Union’s Horizon 2020 research and innovation programme under agreement No. 727284.</b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
}
</script>

<style>
  #diversiplotter-logo {
    max-height: 30vh;
  }
  .home-container {
    margin-top: 100vh;
  }
  .bg-img {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background-position: center;
    background-size: cover;
    background-attachment: fixed;
  }

  .bg-img .overlay {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: .6;
    background: #1C1D21;
  }

  .home-wrapper {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    text-align: center;
    color: white;
  }

  .mouse-icon {
    position: absolute;
    left: 50%;
    bottom: 40px;
    border: 2px solid #fff;
    border-radius: 16px;
    height: 50px;
    width: 30px;
    margin-left: -17px;
    display: block;
    z-index: 10;
  }
  .mouse-icon .wheel {
    position: relative;
    border-radius: 10px;
    background: #fff;
    width: 4px;
    height: 10px;
    top: 4px;
    margin-left: auto;
    margin-right: auto;
  }
  .mouse-icon .wheel {
    -webkit-animation-name: drop;
    -webkit-animation-duration: 1s;
    -webkit-animation-timing-function: linear;
    -webkit-animation-delay: 0s;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-play-state: running;
    animation-name: drop;
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-delay: 0s;
    animation-iteration-count: infinite;
    animation-play-state: running;
  }
  @-webkit-keyframes drop {
    0% {
      top: 5px;
      opacity: 0;
    }
    30% {
      top: 10px;
      opacity: 1;
    }
    100% {
      top: 25px;
      opacity: 0;
    }
  }

  @keyframes drop {
    0% {
      top: 5px;
      opacity: 0;
    }
    30% {
      top: 10px;
      opacity: 1;
    }
    100% {
      top: 25px;
      opacity: 0;
    }
  }
</style>
