import { HeadChange, LotusRPC } from '@filecoin-shipyard/lotus-client-rpc'
import { mainnet } from '@filecoin-shipyard/lotus-client-schema'
import { NodejsProvider } from '@filecoin-shipyard/lotus-client-provider-nodejs'

const endpointUrl = 'wss://api.chain.love/rpc/v0'
const provider = new NodejsProvider(endpointUrl)
let client: LotusRPC

async function main () {
  client = new LotusRPC(provider, { schema: mainnet.fullNode })
  try {
    /** REPLACE NEXT LINE WITH EXAMPLE FUNCTION CALL **/
    await chainHeadEx()
  } finally {
    client.destroy()
  }
}

main().catch(console.error)

// EXAMPLES ////////////////////////////////////////////////////////////////////

async function chainHeadEx () { // eslint-disable-line no-unused-vars
  const head = await client.chainHead()
  console.log('chainHead=', head)
}

async function chainNotifyEx () { // eslint-disable-line no-unused-vars
  const [cancel, ready] = client.chainNotify((data: HeadChange[]) => {
    console.log(data)
  })

  await ready
  console.log('sub ready')

  await new Promise<void>(resolve => {
    process.on('SIGINT', resolve)
  })
  console.log('SIGINT received')
  cancel()
}

async function minerListEx () { // eslint-disable-line no-unused-vars
  const head = await client.chainHead()
  const miners = await client.stateListMiners(head.Cids)
  console.log('miners=', miners)
}
