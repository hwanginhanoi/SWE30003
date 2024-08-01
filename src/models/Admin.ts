import Account from './Account'
class Admin extends Account {

    constructor()
    constructor(email: String)
    constructor(name: String, email: String)
    constructor(name: String, email: String, pwd: String)
    constructor(name?: String, email?: String, pwd?: String) {
        super(name, email, pwd, 'admin')
    }
}

export default Admin