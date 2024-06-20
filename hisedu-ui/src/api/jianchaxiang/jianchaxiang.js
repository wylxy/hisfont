import request from '@/utils/request'

// 查询检查项目管理列表
export function listJianchaxiang(query) {
  return request({
    url: '/jianchaxiang/jianchaxiang/list',
    method: 'get',
    params: query
  })
}

// 查询检查项目管理详细
export function getJianchaxiang(id) {
  return request({
    url: '/jianchaxiang/jianchaxiang/' + id,
    method: 'get'
  })
}

// 新增检查项目管理
export function addJianchaxiang(data) {
  return request({
    url: '/jianchaxiang/jianchaxiang',
    method: 'post',
    data: data
  })
}

// 修改检查项目管理
export function updateJianchaxiang(data) {
  return request({
    url: '/jianchaxiang/jianchaxiang',
    method: 'put',
    data: data
  })
}

// 删除检查项目管理
export function delJianchaxiang(id) {
  return request({
    url: '/jianchaxiang/jianchaxiang/' + id,
    method: 'delete'
  })
}


// 设置状态
export function updateStatus(id,status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/jianchaxiang/jianchaxiang/updateStatus',
    method: 'post',
    data: data
  })
}
