/**
 * 上传图片
 * @param e
 * @returns {Promise}
 */
export const upload = (file) => {
  // 文件大小,单位为M
  return new Promise((resolve) => {
    let FR = new FileReader();
    FR.onload = function () {
        resolve(this.result)
    };
    //先注册onload，再读取文件内容，否则读取内容是空的
    FR.readAsDataURL(file);
  })
}