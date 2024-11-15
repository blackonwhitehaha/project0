// src/stores/orgStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';

interface User {
  userID: number;
  userName: string;
  userAccount: string;
  section: string;
  userPhoneNumber: string;
  createTime: string;
  userState: '正常' | '停用';
}

interface Department {
  departmentID: number;
  departmentName: string;
  users: User[];
}

interface Company {
  companyID: number;
  renterName: string;
  departments: Department[];
}

interface Association {
  associationID: number;
  renterName: string;
  companies: Company[];
}



export const useOrgStore = defineStore('orgStore', {
  state: () => ({
    orgData: [] as Association[],
    users: [] as User[]
  }),
  actions: {
    async fetchOrgData() {
      try {
        const res = await axios.get('http://localhost:8888/user/getUserInfo');
        const loginUserType = res.data.loginUser.userType;
        const loginUserID = res.data.loginUser.userID;
        if (loginUserType === 'Admin') {
          const response = await axios.post('http://localhost:8888/user/allListAdmin', {userID:loginUserID});
          this.orgData = [
            {
              id: response.data.company.renterID,
              label: response.data.company.renterName,
              children: response.data.company.departments.map((dept: Department) => ({
                id: dept.departmentID,
                label: dept.departmentName,
              }))
            }
          ];      
        } else {
          const response = await axios.get('http://localhost:8888/user/allList');
          this.orgData = response.data.associations.map((assoc: Association) => ({
            id: assoc.associationID,
            label: assoc.renterName,
            children: assoc.companies.map((comp: Company) => ({
              id: comp.companyID,
              label: comp.renterName,
              children: comp.departments.map((dept: Department) => ({
                id: dept.departmentID,
                label: dept.departmentName,
                users: dept.users
              }))
            }))
          }));
        }
      } catch (error) {
        console.error('Error fetching org data:', error);
      }
    },
    setUsers(users: User[]) {
      this.users = users;
    }
  }
});
