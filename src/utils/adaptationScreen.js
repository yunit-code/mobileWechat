/**
 * 
 * @param {*} initSize 配置的初始尺寸
 * @returns  计算后的尺寸 type Number
 */
export const getComputedSize = function (initSize) {
  if(this.moduleObject.env == 'develop' && !this.pageWidth) return initSize
  initSize = Number(initSize)
  const WINDOW_WIDTH = this.pageWidth || window.screen.width                                    // 当前屏幕宽度
  const BASE_SIZE = Number(this.propData.baseSize)  || 414                       // 配置屏幕基准值宽度
  const ADAPTATION_RATIO = Number(this.propData.adaptationRatio) || 1.2         // 配置适配比例
  const FINAL_RESULT = initSize * ((WINDOW_WIDTH / BASE_SIZE - 1) * (ADAPTATION_RATIO - 1) + 1)
  if(!WINDOW_WIDTH || !BASE_SIZE || !ADAPTATION_RATIO || window.isNaN(FINAL_RESULT)) {
    // console.error(`
    //   In ${this.$options.name} Calculate's params error
    //   WINDOW_WIDTH      ---->  ${WINDOW_WIDTH}
    //   BASE_SIZE         ---->  ${BASE_SIZE}
    //   ADAPTATION_RATIO  ---->  ${ADAPTATION_RATIO}
    //   FINAL_RESULT      ---->  ${FINAL_RESULT}
    // `)
    return initSize
  }
  return Math.round(FINAL_RESULT)
}
export const translatePxToAdaptationApi = function(data,adaptationBase = 414,adaptationPercent = 1.2,clientWidth = 414) {
  if ( (!data) && data !== 0 ) {
      return 
  }
  let percent = ( ( clientWidth/adaptationBase - 1 ) * ( adaptationPercent - 1 ) + 1 )
  return parseInt( data * percent ) 
}