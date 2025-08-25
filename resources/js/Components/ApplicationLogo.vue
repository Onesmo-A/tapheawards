<template>
  <div class="gold-gradient-border">
    <img
      src="/images/logo.png"
      alt="Business Awards Logo"
      class="logo-img"
    />
  </div>
</template>

<style scoped>
.gold-gradient-border {
margin-top: auto;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 12px rgba(188, 10, 25, 0.765);
}

.logo-img {
  width: 150%;
  height: 150%;
  object-fit: contain;
  border-radius: 50%; /* optional, only if logo itself is round */
  background: transparent; /* ensure no bg */
}
</style>
