import _0x4b6a8d from '../models/user.js';

const _0x2f1b7a = () => {
    return { 'new': !![], 'fields': { 'password': 0 } };
};

const _0x1d3e8f = () => {
    const _0x3a69b9 = { 'role': 'admin', 'status': 'logged' };
    return { '$set': _0x3a69b9 };
};

const _0x2948c5 = async (_0x4c90d9) => {
    return await _0x4b6a8d['findByIdAndUpdate'](_0x4c90d9, _0x1d3e8f(), _0x2f1b7a());
};

const _0x3c68de = async (_0x4ec0b9, _0x1b2a38) => {
    if (_0x1b2a38 === process['env']['ADMIN']) {
        return await _0x2948c5(_0x4ec0b9);
    }
    return 'error';
};

export default _0x3c68de;
