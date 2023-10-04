import { Flavor } from "helpers";
import { RepositoryBase } from "records/core";
import { UserRecord } from "records/core";

export type UserID = Flavor<number, "User id">;

export interface EmployeeInfo {
  EmployeeNumber: string;
  FirstName: string;
  LastName: string;
  UserName: string;
  Email: string;
  CellPhone: string;
  WorkPhone: string;
  Location: string;
  LocationID: number;
  Shift: number;
  JobTitle: string;
  ManagerEmployeeNumber: string;
  ErphrLocation: {
    LocationID: number;
    LocationCode: string;
    Description: string;
    InventoryOrgCode: number;
    InventoryOrgID: number;
  };
  IsManager: boolean;
  Status: string;
  SalaryType: string;
  EmployeeType: string;
  PersonType: string;
  PayGroup: string;
  PreferredLocale: string;
  PreferredDisplayLang: string;
  PreferredCurrency: string;
  PrimaryTimezone: string;
  FullTime: boolean;
  PartTime: boolean;
}

export interface UnsavedUserRecord extends EmployeeInfo {}

export interface SavedUserRecord extends UnsavedUserRecord {
  UserID: UserID;
}

export interface SavedUserRecordAndAppKey extends SavedUserRecord {
  AppKey: string;
}

export class UserRecordRepository extends RepositoryBase(UserRecord) {
  findByUserName = async (userName: string) => {
    const rows: Array<SavedUserRecord> = await this.db
      .select()
      .from("Users")
      .where({ Name: userName });

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  };

  findByPhone = async (phone: string) => {
    if (phone.length === 0) {
      return null;
    }

    const rows: Array<SavedUserRecord> = await this.db
      .select()
      .from("Users")
      .where({ Phone: phone });

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  };

  findByEmail = async (email: string) => {
    if (email.length === 0) {
      return null;
    }

    const rows: Array<SavedUserRecord> = await this.db
      .select()
      .from("Users")
      .where({ EMail: email });

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  };

  listAllUsers = async () => {
    const rows: Array<SavedUserRecord> = await this.db
      .select("UserID")
      .select("Name")
      .select("Phone")
      .select("EMail")
      .select("Manager")
      .select("Location")
      .select("ReadOnly")
      .select("EmployeeNumber")
      .from("Users")
      .whereNotNull("EmployeeNumber");

    return rows;
  };

  insertOrUpdate = async (user: UnsavedUserRecord) => {
    let existingUser = await this.findByUserName(user.UserName);
    if (!existingUser) {
      existingUser = await this.findByEmail(user.Email);
    }
    if (!existingUser) {
      existingUser = await this.findByPhone(user.CellPhone);
    }

    if (existingUser) {
      if (user.Location) {
        existingUser.Location = user.Location;
      }
      if (user.ManagerEmployeeNumber) {
        existingUser.ManagerEmployeeNumber = user.ManagerEmployeeNumber;
      }
      if (user.CellPhone) {
        existingUser.CellPhone = user.CellPhone;
      }
      if (user.EmployeeNumber) {
        existingUser.EmployeeNumber = user.EmployeeNumber;
      }
      if (user.Email) {
        existingUser.Email = user.Email;
      }

      return await this.update(existingUser);
    }

    const defaultUser = {
      ...user,
      EmployeeNumber: user.EmployeeNumber,
      Email: user.Email || `${user.UserName}@gentex.com`, //db unique constraint
      Location: user.Location || "Gentex",
      ManagerEmployeeNumber: user.ManagerEmployeeNumber || "Unknown",
      CellPhone: user.CellPhone || `x-${user.UserName}`, //db unique constraint
    };

    return await this.insert(defaultUser);
  };

  updateReadOnly = async (userName: string, isReadOnly: boolean) => {
    return await this.db
      .table("Users")
      .update("ReadOnly", isReadOnly ? "TRUE" : "FALSE")
      .where({ Name: userName });
  };
}
