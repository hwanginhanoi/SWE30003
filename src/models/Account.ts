class Account {
    public name: String | undefined
    public role: String | undefined
    private pwd: String | undefined
    private ID: Number | undefined

    constructor(name: String | undefined, pwd: String | undefined, user: string)
    constructor(email: String)
    constructor(name: String)
    constructor(name: String,  pwd: String, role: String)
    constructor(name?: String, pwd?: String, role?: String) {
        this.pwd = pwd
        this.name = name
        this.role = role
    }

    register() {
        this.ID = Math.round(Math.random() * 10000)
    }

    getJsonObject(): Object {
        return {
            name: this.name,
            pwd: this.pwd,
            role: this.role,
            ID: this.ID
        }
    }
}

export default Account;