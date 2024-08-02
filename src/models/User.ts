import { PrismaClient } from '@prisma/client';
import { Role } from "@prisma/client";
import Admin from "./Admin"
import Customer from "./Customer";

const prisma = new PrismaClient();

abstract class User {
    public name: string;
    public email: string;
    public role: Role;
    private readonly password: string;
    protected id?: number;

    protected constructor(name: string, email: string, password: string, role: Role, id?: number) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.id = id;
    }

    getJsonObject(): object {
        return {
            name: this.name,
            email: this.email,
            role: this.role,
            id: this.id
        };
    }

    async register(): Promise<String> {
        try {
            const account = await prisma.user.create({
                data: {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    role: this.role,
                },
            });
            this.id = account.id;
            return "success"
        } catch (error) {
            console.error('Error registering account:', error);
            return "error"
        }
    }

    static async login(email: string, password: string): Promise<User | null> {
        try {
            const account = await prisma.user.findUnique({
                where: { email },
            });

            if (account && account.password === password) {
                let user: User;
                if (account.role === Role.Admin) {
                    user = new Admin(account.name, account.email, account.password, account.id);
                } else {
                    user = new Customer(account.name, account.email, account.password);
                }

                user.id = account.id;
                return user;
            }
            return null;
        } catch (error) {
            console.error('Error during login:', error instanceof Error);
            return null;
        }
    }
}

export default User;