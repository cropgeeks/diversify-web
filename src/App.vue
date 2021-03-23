<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="dark" class="navigation">
      <b-navbar-brand to="/">
        <b-img :src="require('@/assets/diversiplotter.svg')" id="logo" class="d-inline-block align-top" alt="DIVERSiplotter"/>
        DIVERSiplotter
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/plotdata">Plot data</b-nav-item>
          <b-nav-item to="/speciesdata">Species data</b-nav-item>
          <b-nav-item to="/traits">Traits</b-nav-item>
          <b-nav-item to="/varieties">Varieties</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view :key="$route.path" id="content" class="mb-3 pb-3"/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
.navigation {
  z-index: 1;
}
#logo {
  height: 30px;
}
</style>
