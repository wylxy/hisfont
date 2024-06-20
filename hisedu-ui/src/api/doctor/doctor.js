import request from '@/utils/request'

// 查询医生管理列表
export function listDoctor(query) {
  return request({
    url: '/doctor/doctor/list',
    method: 'get',
    params: query
  })
}

// 查询医生管理详细
export function getDoctor(id) {
  return request({
    url: '/doctor/doctor/' + id,
    method: 'get'
  })
}

// 新增医生管理
export function addDoctor(data) {
  return request({
    url: '/doctor/doctor',
    method: 'post',
    data: data
  })
}

// 修改医生管理
export function updateDoctor(data) {
  return request({
    url: '/doctor/doctor',
    method: 'put',
    data: data
  })
}

// 删除医生管理
export function delDoctor(id) {
  return request({
    url: '/doctor/doctor/' + id,
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
    url: '/doctor/doctor/updateStatus',
    method: 'post',
    data: data
  })
}

// 查询能耗拓扑详细
export function getDoctorList(id) {
  return request({
    url: '/doctor/doctor/getDoctorList/' + id,
    method: 'get'
  })
}
