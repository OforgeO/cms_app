import Config from './Config';
let base_url = 'http://storeapp.giftyou.tokyo:5010/';
//let base_url = 'http://storeapp.excill.com:5010/';
let _headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};
let branch_id = Config.branchID;
function createCall(path, data = null, token = null, headers = {}, method = 'POST') {
    const merged = {
        ..._headers,
        ...headers,
    };

    let body = {};
    if (data) {
        body = {
            ...body,
            ...data,
         };
    }
    if (token) {
        body.api_token = token;
    }
    let strData = JSON.stringify({data: body});
    return fetch(
        `${base_url}${path}`, {
            method,
            headers: merged,
            body: strData,
        },
    ).then((resp) => resp.json());
}

export function registerUser(user_id, device_type, device_id){
    if(device_type == 'ios')
        device_type = 2;
    else if(device_type == 'android')
        device_type = 1;
    else
        device_type = 0;
    return createCall(
        'app/registerUser',
        {user_id, device_type, device_id, branch_id}
    );
}

export function updateUser(user_id, login_id, password){
    return createCall(
        'app/updateUser',
        {user_id, login_id, password, branch_id}
    );
}

export function getSlide(){
    return createCall(
        'app/getSlide',
        {branch_id}
    );
}

export function HFImage(){
    return createCall(
        'app/HFImage',
        {branch_id}
    );
}

export function checkMenuType(){
    return createCall(
        'app/checkMenuType',
        { branch_id}
    );
}

export function getTopMenu(os, type){
    return createCall(
        'app/getTopMenu',
        {os, type, branch_id}
    );
}

export function getNews(os){
    return createCall(
        'app/getNews',
        {os,branch_id}
    );
}

export function deviceExist(deviceID){
    return createCall(
        'app/deviceExist',
        {deviceID,branch_id}
    );
}

export function getLatLng(){
    return createCall(
        'app/getLatLng',
        {branch_id}
    );
}

export function getWebviewList(){
    return createCall(
        'app/getWebviewList',
        {branch_id}
    );
}

export function getPhotoVideo(){
    return createCall(
        'app/getPhotoVideo',
        {branch_id}
    );
}

export function getCompanyProfile(){
    return createCall(
        'app/getCompanyProfile',
        {branch_id}
    );
}

export function getStoreInformation(){
    return createCall(
        'app/getStoreInformation',
        {branch_id}
    );
}

export function getSocial(){
    return createCall(
        'app/getSocial',
        {branch_id}
    );
}

export function getLayoutSetting(){
    return createCall(
        'app/getLayoutSetting',
        {branch_id}
    );
}

export function getPhilosophy(){
    return createCall(
        'app/getPhilosophy',
        {branch_id}
    );
}

export function getIntroduction(){
    return createCall(
        'app/getIntroduction',
        {branch_id}
    );
}

export function getHistory(){
    return createCall(
        'app/getHistory',
        {branch_id}
    );
}

export function getCatalogue(type){
    return createCall(
        'app/getCatalogue',
        {type, branch_id}
    );
}

export function getGallery(ID){
    return createCall(
        'app/getGallery',
        {ID,branch_id}
    );
}
export function getStaff(){
    return createCall(
        'app/getStaff',
        {branch_id}
    );
}
export function getReservation(user_id){
    return createCall(
        'app/getReservation',
        {user_id,branch_id}
    );
}
export function addReservation(number, date, time, user_id){
    return createCall(
        'app/addReservation',
        {number, date, time, user_id, branch_id}
    );
}
export function cancelReservation(id){
    return createCall(
        'app/cancelReservation',
        {id, branch_id}
    );
}
export function getCoupon(cur_time, user_id){
    return createCall(
        'app/getCoupon',
        { branch_id, cur_time, user_id }
    )
}
export function getCouponDetail(id){
    return createCall(
        'app/getCouponDetail',
        { branch_id, id }
    )
}
export function getStamp(){
    return createCall(
        'app/getStamp',
        { branch_id }
    )
}
export function getStampDetail(id, user_id){
    return createCall(
        'app/getStampDetail',
        { id, user_id, branch_id }
    )
}
export function getPageColor(id){
    return createCall(
        'app/getPageColor',
        { branch_id }
    )
}
export function getBookInput(){
    return createCall(
        'app/getBookInput',
        { branch_id }
    )
}
export function getRservableDay(){
    return createCall(
        'app/getRservableDay',
        { branch_id }
    )
}
export function addBook(name,phone,email,numberofperson, selday,timebook,employee, user_id, markedDates){
    return createCall(
        'app/addBook',
        { name,phone,email,numberofperson, selday,timebook, employee, user_id, markedDates, branch_id}
    )
}
export function cancelBook(id, type){
    return createCall(
        'app/cancelBook',
        { id, type, branch_id }
    )
}
export function getBookDetail(id){
    return createCall(
        'app/getBookDetail',
        { id,branch_id }
    )
}
export function getEmployeeList(bookDay, bookTime){
    return createCall(
        'app/getEmployeeList',
        { bookDay, bookTime, branch_id }
    )
}
export function updateBook(name,phone,email,numberofperson, selday,timebook,employee, user_id, book_id, markedDates){
    return createCall(
        'app/updateBook',
        { name,phone,email,numberofperson, selday,timebook, employee, user_id, book_id, markedDates, branch_id }
    )
}
export function getBookOrder(time){
    return createCall(
        'app/getBookOrder',
        { time, branch_id }
    )
}
export function addBookOrder(name,phone,email,numberofperson, order, selday, type, user_id){
    return createCall(
        'app/addBookOrder',
        { name,phone,email,numberofperson, selday, order, type, user_id,branch_id }
    )
}
export function getInquirySetting(){
    return createCall(
        'app/getInquirySetting',
        { branch_id }
    )
}

export function sendInquiry(setting, user_id){
    return createCall(
        'app/sendInquiry',
        { setting, user_id, branch_id }
    )
}

export function addStamp(user_id, id, qr_no){
    return createCall(
        'app/addStamp',
        { user_id, id, qr_no, branch_id }
    )
}

export function getFreecontentList(){
    return createCall(
        'app/getFreecontentList',
        { branch_id }
    )
}

export function getFreecontentDetail(id){
    return createCall(
        'app/getFreecontentDetail',
        { id,branch_id }
    )
}

export function getMaincontentList(type){
    return createCall(
        'app/getMaincontentList',
        { type, branch_id }
    )
}

export function getMaincontentDetail(type){
    return createCall(
        'app/getMaincontentDetail',
        { type,branch_id }
    )
}

export function getPostcontentList(type, cur_time){
    return createCall(
        'app/getPostcontentList',
        { type, cur_time,branch_id }
    )
}
export function getPostContent(type, cur_time){
    return createCall(
        'app/getPostContent',
        { type, cur_time,branch_id }
    )
}
export function getPostcontentDetail(id){
    return createCall(
        'app/getPostcontentDetail',
        { id,branch_id }
    )
}
export function getWebviewLink(id){
    return createCall(
        'app/getWebviewLink',
        { id, branch_id }
    )
}
export function useCoupon(id){
    return createCall(
        'app/useCoupon',
        { id, branch_id }
    )
}
export function loginUser(login_id, password, type){
    return createCall(
        'app/loginUser',
        { login_id, password, type, branch_id }
    )
}
export function updateLoginTime(user_id){
    return createCall(
        'app/updateLoginTime',
        { user_id, branch_id }
    )
}
export function getSurveyList(cur_time){
    return createCall(
        'app/getSurveyList',
        { cur_time, branch_id }
    )
}
export function getSurveyDetail(id){
    return createCall(
        'app/getSurveyDetail',
        { id, branch_id }
    )
}
export function getSurveyQuestion(id){
    return createCall(
        'app/getSurveyQuestion',
        { id, branch_id }
    )
}
export function getSurveyOptions(id, no){
    return createCall(
        'app/getSurveyOptions',
        { id, no, branch_id }
    )
}
export function addOptionAnswer(user_id, survey_id, survey_no, answer, option_id, answertype = ''){
    return createCall(
        'app/addOptionAnswer',
        { user_id, survey_id, survey_no, answer, option_id, answertype, branch_id }
    )
}
export function getMemberInfo(){
    return createCall(
        'app/getMemberInfo',
        { branch_id }
    )
}
export function getPostCategory(type){
    return createCall(
        'app/getPostCategory',
        { type, branch_id }
    )
}
export function getFooterMenu(){
    return createCall(
        'app/getFooterMenu',
        { branch_id }
    )
}
export function getHeaderIcon(){
    return createCall(
        'app/getHeaderIcon',
        { branch_id }
    )
}
export function getSpecPostcontent(type){
    return createCall(
        'app/getSpecPostcontent',
        { type, branch_id }
    )
}
export function getTopMenuOne(){
    return createCall(
        'app/getTopMenuOne',
        { branch_id }
    )
}
export function getBookDescription(){
    return createCall(
        'app/getBookDescription',
        { branch_id }
    )
}
export function getLanguages(){
    return createCall(
        'app/getLanguages',
        { branch_id }
    )
}
