/**
 * 
 * @param {*} initSize 配置的初始尺寸
 * @returns  计算后的尺寸 type Number
 */
export const getComputedSize = function (initSize) {
  if(this.moduleObject.env == 'develop' && !this.pageWidth) return initSize
  initSize = Number(initSize)
  const WINDOW_WIDTH = this.pageWidth                                     // 当前屏幕宽度
  const BASE_SIZE = Number(this.propData.baseSize)                        // 配置屏幕基准值宽度
  const ADAPTATION_RATIO = Number(this.propData.adaptationRatio)          // 配置适配比例
  if(!WINDOW_WIDTH || !BASE_SIZE || !ADAPTATION_RATIO) {
    console.error(WINDOW_WIDTH, BASE_SIZE, ADAPTATION_RATIO, 'calculate error')
    return initSize
  }
  const FINAL_RESULT = initSize * ((WINDOW_WIDTH / BASE_SIZE - 1) * (ADAPTATION_RATIO - 1) + 1)
  return Math.round(FINAL_RESULT)
}