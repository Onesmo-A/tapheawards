<template>
  <div class="logo-wrapper">
    <img
      src="/images/logo.png"
      alt="Taphea Logo"
      class="logo-img"
    />
  </div>
</template>

<style scoped>
.logo-wrapper {
  width: 60px;                  
  height: 60px;
  border-radius: 50%;            
  padding: 1px;                  
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #bd0000, #ffffff); /* Red → White gradient */
  box-shadow: 0 0 6px rgba(0,0,0,0.2); /* subtle shadow */
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
  background: transparent;
}
</style>
