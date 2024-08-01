import Account from './Account'
class Admin extends Account {

    constructor()
    constructor(name: String)
    constructor(name: String, pwd: String)
    constructor(name?: String,  pwd?: String) {
        super(name, pwd, 'admin')
    }
}

export default Admin