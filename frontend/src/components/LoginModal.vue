<template>
  <transition name="modal">
    <div class="modal-mask" @click="$emit('close-modal')">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
              <slot name="header">
              </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
            </slot>
          </div>

          <div class="modal-footer">
              <slot name="footer">
              </slot>
         </div>
      </div>
    </div>
   </div>
  </transition>
</template>

<script>

export default ({
    data() {
        return {
           
        }
    },
})
</script>

<style scoped>
.modal-mask{
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 400px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 7px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  display: flex;
  flex-direction: column;
}

.modal-header {
  justify-content: center;
  color: #42b983;
  font-size: 23px;
  font-weight: 500;
}

.modal-body {
  margin-top: 20px;
  font-size: 14px;
}

.modal-footer {
    margin: 0px;
    font-size: 13px;
}
</style>