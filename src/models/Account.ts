class Account {
    public name: String | undefined
    public email: String | undefined
    public role: String | undefined
    private pwd: String | undefined
    private ID: Number | undefined

    constructor(name: String | undefined, email: String | undefined, pwd: String | undefined, user: string)
    constructor(email: String)
    constructor(name: String, email: String)
    constructor(name: String, email: String, pwd: String, role: String)
    constructor(name?: String, email?: String, pwd?: String, role?: String) {
        this.pwd = pwd
        this.name = name
        this.email = email
        this.role = role
    }

    register() {
        this.ID = Math.round(Math.random() * 10000)
    }

    getJsonObject(): Object {
        return {
            email: this.email,
            name: this.name,
            pwd: this.pwd,
            role: this.role,
            ID: this.ID
        }
    }
}

export default Account;