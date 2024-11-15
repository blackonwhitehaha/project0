export interface Enterprise {
  compId: string;
  name: string;
  location: string;
  photoUrl: string | null;
}

export interface LoginForm {
  username: string;
  password: string;
  captcha: string;
}

export interface User {
  email?: string;
  phone?: string;
  nickName?: string;
  userID: number;
  userName: string;
  userAccount: string;
  section: string;
  userPhoneNumber: string;
  createTime: string;
  userState: "正常" | "停用";
}

export interface UserQuery {
  name: string;
  phone: string;
  createdAt: string | null;
  userState: '正常' | '停用' | '';
}

export interface Tenant {
  renterID?: number;
  renterName?: string;
  renterContact?: string;
  renterPhoneNumber?: string;
  renterAdmin?: string;
  renterIcon ?:string;
  companyID?:string;
  parentCompanyID?:string;
}

export interface TenantQuery {
  renterID ?:number;
   renterName?: string;
  renterContact?: string;
  renterPhoneNumber?: string;

}

export interface Department {
  id: number;
  name: string;
  sort: string;
  creationTime: string;
  status: '正常' | '停用';
}

export interface DepartmentQuery {
  name: string;
  status: '正常' | '停用' | '';
}

export interface News {
  newsID?: number;
  newsTitle?: string;
  newsInfo?: string;
  newsPic?: string;
  newsAuthor?: string;
  newsContent?:string;
  newsRenter?:string;
}

export interface NewsQuery {
 
  newsTitle?: string;
  newsPic?: string;
  newsAuthor?: string;
  newsInfo?: string;
}

export interface Course {
  courseID: number;
  courseName: string;
  courseInfo: string;
  courseRank: number;
  courseAuthor: string;
}

export interface CourseQuery {
  name?: string;
  order?: number | null;
}

export interface Meeting {
  id: number;
  name: string;
  organizer: string;
  startTime: string;
  Conferencecontent: string;
  status: '进行中' | '已完成';
}

export interface MeetingQuery {
  name: string;
  organizer: string;
  startTime: string | null;
}