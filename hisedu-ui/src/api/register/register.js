import request from '@/utils/request'

// 查询挂号管理列表
export function listRegister(query) {
  return request({
    url: '/register/register/list',
    method: 'get',
    params: query
  })
}

// 查询挂号管理详细
export function getRegister(id) {
  return request({
    url: '/register/register/' + id,
    method: 'get'
  })
}

// 新增挂号管理
export function addRegister(data) {
  return request({
    url: '/register/register',
    method: 'post',
    data: data
  })
}

// 修改挂号管理
export function updateRegister(data) {
  return request({
    url: '/register/register',
    method: 'put',
    data: data
  })
}

// 删除挂号管理
export function delRegister(id) {
  return request({
    url: '/register/register/' + id,
    method: 'delete'
  })
}
