import UserModel from "../model/user.model";

export class UserAPI {

    async getUser(userId: string) {
        const user = await UserModel.findById(userId);
        if (!user) {
            return null;
        }
        return user;

    }
}
