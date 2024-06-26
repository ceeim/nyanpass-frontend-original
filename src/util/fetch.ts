import { logoutLocal } from "../AppApi";
import { MyMessage } from "./MyModal";
import { commonEx, showCommonError, showJsError } from "./commonError";

// 如果不设置 success 或 fail 则用对话框输出， ret 至少有 code
export function asyncFetchJson(promise: Promise<any>, success?: (ret?: any) => void, fail?: (error: any) => void) {
    let myFail = (error: any) => { showJsError("请求出错", error) }
    if (fail != null) myFail = fail
    setTimeout(async () => {
        try {
            const ret = await promise
            if (ret == null || ret["code"] == null) {
                myFail(new Error("未知的返回数据"))
            } else if (ret["logout"]) {
                logoutLocal()
            } else if (success != null) {
                success(ret)
            } else {
                showCommonError(ret, ["请求成功", "请求失败"])
            }
        } catch (error: any) {
            if (error != commonEx) {
                console.log("fetch error", error)
                MyMessage.error("fetch error: " + error)
                myFail(error)
            }
        }
    });
}

// 和上面一样，只是改为返回 promise
export function promiseFetchJson(promise: Promise<any>, success?: (ret?: any, data?: any) => void, fail?: (error: any) => void) {
    let myFail = (error: any) => { showJsError("请求出错", error) }
    if (fail != null) myFail = fail
    return (async () => {
        try {
            const ret = await promise
            if (ret["code"] == null) {
                myFail(new Error("未知的返回数据"))
            } else if (ret["logout"]) {
                logoutLocal()
            } else if (success != null) {
                success(ret, ret.data)
            } else {
                showCommonError(ret, ["成功", "失败"])
            }
        } catch (error: any) {
            if (error != commonEx) {
                console.log("fetch error", error)
                MyMessage.error("fetch error: " + error)
                myFail(error)
            }
            throw error
        }
    })();
}
