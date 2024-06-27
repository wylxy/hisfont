import request from '@/utils/request'

// 查询医生管理列表
export function listDoctor(query) {
  return request({
    url: '/doctor/list',
    method: 'get',
    params: query
  })
}

// 查询医生管理详细
export function getDoctor(id) {
  return request({
    url: '/doctor/getOne?id=' + id,
    method: 'get'
  })
}

// 新增医生管理
export function addDoctor(data) {
  return request({
    url: '/doctor/add',
    method: 'post',
    data: data
  })
}

// 修改医生管理
export function updateDoctor(data) {
  return request({
    url: '/doctor/update',
    method: 'post',
    data: data
  })
}

// 删除医生管理
export function delDoctor(id) {
  return request({
    url: '/doctor/delete?id=' + id,
    method: 'get'
  })
}

// 设置状态
export function updateStatus(id,status) {
  return request({
    url: '/doctor/updateStatus?id='+id+'&status='+status,
    method: 'get',
  })
}

// 查询能耗拓扑详细
export function getDoctorList(id) {
  return request({
    url: '/doctor/doctor/getDoctorList/' + id,
    method: 'get'
  })
}
