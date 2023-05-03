import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

function Profile() {
    const { address, isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()

    if (isConnected)
        return (
            <div className='flex justify-between'>
                <button className="btn btn-active btn-primary" onClick={() => disconnect()}>Disconnect</button>
                <p>Connected to {address}</p>
            </div>
        )
    return <div><button className="btn" onClick={() => connect()}>Connect Wallet</button> </div >
}

export default Profile;