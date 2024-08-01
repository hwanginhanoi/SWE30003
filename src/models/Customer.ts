import Account from './Account'
class Customer extends Account {

    constructor()
    constructor(name: String)
    constructor(name: String, pwd: String)
    constructor(name?: String, pwd?: String) {
        super(name, pwd, 'admin')
    }
}

export default Customer