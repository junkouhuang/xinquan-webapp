import request from '@/plugin/axios'
import qs from 'qs'



// base64
const upload = data=> {
    return request ({
        url: '/common/image/upload',
        method: 'post',
        data: qs.stringify(data),
    })
}
// 文件流
const uploads = data=> {
    return request ({
        url: '/common/image/uploads',
        method: 'post',
        data: qs.stringify(data),
    })
}





export {
    upload,
    uploads,
}
