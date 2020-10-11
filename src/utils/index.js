export default {
  // 搜索 table 关键词
  searchKeyword: (val) => {
    let keyword = val.trim()
    let row = document.querySelectorAll('.el-table__row')
    for (let i = 0; i < row.length; i ++) {
      row[i].style.display = row[i].innerText.indexOf(keyword) < 0 ? 'none' : ''
    }
  }
}
