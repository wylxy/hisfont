import request from '@/utils/request'

// 查询科室管理列表
export function listKeshi(query) {
  return request({
    url: '/keshi/keshi/list',
    method: 'get',
    params: query
  })
}


// 查询科室管理列表
export function getKeshiList() {
  return request({
    url: '/keshi/keshi/getKeshiList',
  })
}

// 查询科室管理详细
export function getKeshi(id) {
  return request({
    url: '/keshi/keshi/' + id,
    method: 'get'
  })
}

// 新增科室管理
export function addKeshi(data) {
  return request({
    url: '/keshi/keshi',
    method: 'post',
    data: data
  })
}

// 修改科室管理
export function updateKeshi(data) {
  return request({
    url: '/keshi/keshi',
    method: 'put',
    data: data
  })
}


// 设置状态
export function updateStatus(id,status) {
  console.log(id+"======="+status);
  const data = {
    id,
    status
  }
  return request({
    url: '/keshi/keshi/updateStatus',
    method: 'post',
    data: data
  })
}

// 删除科室管理
export function delKeshi(id) {
  return request({
    url: '/keshi/keshi/' + id,
    method: 'delete'
  })
}
