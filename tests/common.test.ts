import { createAndServe } from '../src/server'
import axios from 'axios'
import { describe } from 'node:test'
import express from 'express'
import http from 'http'

let app: http.Server | undefined
describe('basic api', () => {
  beforeAll(() => {
    app = createAndServe()
  })

  afterAll(() => {
    if (app) {
      app.close()
    }
  })

  test('get chains', async () => {
    const resp = await axios.get('http://127.0.0.1:3001/chains')

    expect(resp.status).toBe(200)
    expect(resp.data).not.toBe(undefined)
  })

  test('get chain props', async () => {
    const resp = await axios.post('http://127.0.0.1:3001/node/props', { id: 'dot' })

    expect(resp.status).toBe(200)
    expect(resp.data).not.toBe(undefined)
  })

  test('get chain metadata', async () => {
    const resp = await axios.post('http://127.0.0.1:3001/node/metadata', { id: 'dot' })

    expect(resp.status).toBe(200)
    expect(resp.data).not.toBe(undefined)
  })

  test('get chain metadata hash', async () => {
    const resp = await axios.post('http://127.0.0.1:3001/node/metadata/hash', { id: 'dot' })

    expect(resp.status).toBe(200)
    expect(resp.data).not.toBe(undefined)
  })

  test('get tx metadata (without checkMetadataHash extension)', async () => {
    const resp = await axios.post('http://127.0.0.1:3001/transaction/metadata', {
      txBlob:
        '0000d050f0c8c0a9706b7c0c4e439245a347627901c89d4791239533d1d2c961f1a72ad615c8530de078e565ba644b38b01bcad249e8c0a80aceb4befe330990a59f74ed976c933db269c64dda40104a0f001900000091b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3a071db11cdbfd29285f25d402f1aee7a1c0384269c9c2edb476688d35e346998',
      chain: { id: 'dot' },
    })

    expect(resp.status).toBe(200)
    expect(resp.data.txMetadata).toBe(
      '0x60000341000000030102082873705f72756e74696d65384d756c74695369676e6174757265011c456432353531390400169d010148656432353531393a3a5369676e617475726500c902082873705f72756e74696d65384d756c74695369676e6174757265011c53723235353139040016cd020148737232353531393a3a5369676e617475726504c902082873705f72756e74696d65384d756c74695369676e617475726501144563647361040016d102014065636473613a3a5369676e617475726508c9020c1c73705f636f72651c73723235353139245369676e617475726500040016a10101205b75383b2036345dcd020c1c73705f636f7265146563647361245369676e6174757265000400160102017c5b75383b205349474e41545552455f53455249414c495a45445f53495a455dd10210306672616d655f73797374656d28657874656e73696f6e733c636865636b5f6d6f7274616c69747938436865636b4d6f7274616c697479000400168506010c4572618106102873705f72756e74696d651c67656e657269630c6572610c45726101244d6f7274616c31363804000300a102850610306672616d655f73797374656d28657874656e73696f6e732c636865636b5f6e6f6e636528436865636b4e6f6e6365000400110120543a3a4e6f6e63658906086870616c6c65745f7472616e73616374696f6e5f7061796d656e74604368617267655472616e73616374696f6e5061796d656e7400040013013042616c616e63654f663c543e8d060c1c73705f636f72651863727970746f2c4163636f756e7449643332000400160401205b75383b2033325d000003200000000304083c7072696d69746976655f74797065731048323536000400160401205b75383b2033325d0c00020310000314000000035c0840706f6c6b61646f745f72756e74696d652c52756e74696d6543616c6c011853797374656d040016cc01ad0173656c663a3a73705f6170695f68696464656e5f696e636c756465735f636f6e7374727563745f72756e74696d653a3a68696464656e5f696e636c7564653a3a64697370617463680a3a3a43616c6c61626c6543616c6c466f723c53797374656d2c2052756e74696d653e00c80c306672616d655f73797374656d1870616c6c65741043616c6c011872656d61726b04011872656d61726b1610011c5665633c75383e00cc0c2873705f72756e74696d65306d756c746961646472657373304d756c746941646472657373010849640400160001244163636f756e7449640019010c2873705f72756e74696d65306d756c746961646472657373304d756c7469416464726573730114496e64657804001501304163636f756e74496e6465780419010c2873705f72756e74696d65306d756c746961646472657373304d756c746941646472657373010c52617704001610011c5665633c75383e0819010c2873705f72756e74696d65306d756c746961646472657373304d756c74694164647265737301244164647265737333320400160401205b75383b2033325d0c19010c2873705f72756e74696d65306d756c746961646472657373304d756c74694164647265737301244164647265737332300400165c01205b75383b2032305d1019010c1c73705f636f72651c65643235353139245369676e617475726500040016a10101205b75383b2036345d9d0100034000000003a10160140800009508000096080000970800009808000099080000c80b0000710c0000c90c0000ca0c000065060000660600006806000069060000a10600000a070000360700006507000066070000670700006807000069070000be070000bf07000025016789ced43a0367885ff3078f5e2fc7a4f410e0de25fc61592fd571a3ddd0992308c0aeb6a568a4d74f481cbb138a78dfb713c343c20a1050c5235b1ad89073b2cb142cc9a3b3bdfcd9ed0e511c36917ae671cc251a6d7fd3d5f85d9a5e7c3fa5c3f90b255b14f7de7904a8a82d6f793db29ea554a3a72d5d7cc8ce6d7737bc0173743df5f2da9aabcea1dd2dbd238bddc043e8ea38535ab63a7992bc96849747568b99743425c3b7952dce707b4f9a80fa40118ef72aaf9dc3f5395ae644511d49fed1b2ae921ef2b57e8ef1f97884c95cb192eb72aff9121b362d353c7607b20d63fcfc9db22e37fbd115d20c0a95bcff4e1a2d198c2c46f56cddbb36c1e3337096be7ded3a487b812f391541f80b87b4a6e5b02e6547f6e87f41a60199a4930eaf1a762ca945720736ba47951700d451e5a5632995a575be272e8299e1210f02304678945b1d3661789ee3b3c94b09cb8210d6997b610086b2f768f914314cbd4b0da441e1d200352230239b6bb43a187e22d1ee788737c0fb38e06a84ae1d7465e3499cb65f80604723105a3c752946df8f689de24809d9a32e785697c476acf0de41e9616da3b42a902176dd8708edd4fded453de1482673dd739e1126551d7657b1d4c973a62afb0fb87ca4023059f8778235367e3664ffb34c6d651737c1c29bf8b17a01b7c6524a998d958d03052f7294aaceaa07c0ce2ccc35cd08872f436caf9d39af986a70fe2923b8a433472c431b18b01a3801d02f187102464cda4c9376ec604df012735ff23739dfc232e0daade3f6e438786f035cf6c8a343efefbf92dfbdf739ca2cb82d84a288bace231a23497fb059ba78dde5d7b41ea49145f8878601aca7c0aed379d9dab0fdf35d4c262dff0664845b741fff26953a5d2c7a489d907b186551a787f47de0fd1d606dfdb6d0c31b568b1e6d21caec884c91aa88564aff5e9c8ee47b3753091ee7fe59d3d68b279dee5d8c28cdd86428a5f1789a440bf1f887e14bc68dca767b0b76b9e253c7f7e4abaf9fcfa4dbcc7a6f537dbed88cf50a7d9686710ddb0144d59907efacb765d05c3456f7061587dce2c7986c2d6dc666d786b91d4a191a677f4b402f6c7e851f4116ad33fef6c4a21b4429b2a4b1c47797e563e87aad368ed6861216f2f4759185f52d75af2a31a2a8f2b10a5087502003f1890da1e82538c9a4065127b9049b877a7ac6638a3b559c1267d7b4f49eeb6d62f952bf666e72d11a0422c3c91c092434c1fd314d9ec50fbed16620ff0bb4542c5a86be835d03e0cfd6734d58523c5a756263416230e1b37cc13bce2426531ca24fbdd8bf0dbe3c0f85d7bd98c1fb6df0c78fc2e9f2702f34140a8c7c613af848034f46ac6459942b40ab97d3a440d3225846cc1f69cf051d8b894b8d44de727dbeb2bab466f3f1a0e7f9e8db72e7014adc6407d1e6cf27a078a0ecf35cc230f109b9b6febea4f045685937351667b4f9c5d203ac57a2b6192da66752008cbe46e4b9a4d1adcd5c738939da73dd4e98c81244e77c304fd3814e151905ab6499c76ccb290d3cc9fa2f41bd00139140b7206e31ff9d98e4beef1d1a2e20bbc4a225773b9327590503729e589420b1a75d86eaabff22d7ceb0a3bce7985ac4ce86e36c57c1716dc9c7e103b2ad5a424a8d0e86dfa17f9a0777cea925237e5e01f242991ef6c33a086b7c0e4bc8c497b88128da54855c26a44774166c1c0c12df62186723dc72187a726913882137fa3921e1778031871fbc47ddf9eaa50b0a79749430145a6491ea04b932fad174e2c3ba25099cdf2ff6fb93e59312a2391582fa6301d039ad6cb34be631295a583d696acdf81f60aef2933d103a4f6838dc8a34267a4bc34f96ba701316325e7166e9d994eaafae1a36114b99fc77cd003b826a4eb3284fb97de0abe331c71e30d7222190ed1ceb320a5e235f247ae4a367e39345f284d7d157b7dab0b11918ccc7d855c89675584a017fae32fbe8f6e6a00d4f2214646fb95b88b2be76a5f3183f890b6757cf45d3847c454a1bf766c077626a49c05f295b5df428a3792a70b1150f81b8f2dfbd1614c71be9c51a53a8cc366b5da97f26546986169bac68e066dc4921c50d3d31f7b93167d1ff3f42b1237a45ffbf39116c9291fa5754e677cdb0b6c1c29094f048d777bd704b36ab9f431fdee3f8440ad530699b9b81bece174a4c0e6c8a849749b3230acc366d2f1faf5663f98fbe2bde7db2293400e29779d28c921ff4517841e98812fcd13389cab1b67d198b1b829616cc39a2f77f50ee706247fa049e8d3a3e25d3c203a6bdafa9c852f00cb804c9346f09c5f75932f0260d7d6b64623771df07d7d793501f5d06be845c97b32a7a75878614cfd3750a3f39f792a36e025437cb75c8e12c606802f40a9540865368acbde951ec8d2b89f04d2a6d2168ff4d215b0125b253e95a7cb55e5ade1e6ac5da9d5d58cb5e2cd5d18d25ae3fb918f214abbdc69c5122550e019b1451f642b7c1727544a7875eca6bf30116c5f75c826f20c8df8e0e1bc4ba6c84115749a32cd464b7596912e5aed4e3acc77016ade848daafb938d5f7f4744d7adfdccc862df5c8ca239a35a773543764f1d1a26072c68f516029097636910f24e375120482d2fc6daf35102f7c29bd9813d030d156bd0face37a47937be063b0266760766cd46d835764bdff25e24df5ed38f32e0d8da21c1c8de4c9ee8a0b7a4f70c08c9efc0ace26aef368b8aa5c34bef19a95ec79f4a17a53cb7b46b03b872e2eeb8d11b608248a4bf93910ca8dcbb9ddbb45f6b6f137da120bdd23b2835495bdb293da5f7195f338b604036fc9934315b19b8879243319d62ec6683a4929a57b63a0e8448039385ad11e6e71250c61bc4e8f0958fc30aa2702eae5209084ab6c5b03c3e178acb187ce8cafacd47717fc1c95e36d0451a59ac29716afcb1c9b60ae84e1cddf6eb72179718426c7e76996a32f8d3a1c3571406e43c3c92e66a85453bafc09db87a5823738aee33d23d358145b3538e76d4659e74cd5f5548871e6dd103ba4af5d6ff6f170de073361d9ea751683cba3837e2820de029ed100c52ed286700051b1dc8d94fc887a7e3bf71fe5cae00dc09e26c5beaf0bb8dc2785524253ac88b3dd7a38a6b53c4b86878140c4747eb4b3e24ce100674c456d5a40c2471bd6f9f539778f78129b9790936115677923895ffce590b5b70cd637ae1c497718a5cd5178022f4ae71d85b12d9fcf1766754b3548fef3621b3fb9b21b11e9f902f8cd4e4ef20f0556d5ac48834de84ba0a9cea50416190116c816c9022448436865636b4e6f6e5a65726f53656e646572151540436865636b5370656356657273696f6e150538436865636b547856657273696f6e150530436865636b47656e6573697315160c38436865636b4d6f7274616c697479168106160c28436865636b4e6f6e6365168906152c436865636b5765696768741515604368617267655472616e73616374696f6e5061796d656e74168d06154850726576616c6964617465417474657374731515104a0f0020706f6c6b61646f7400000a0c444f54',
    )
  })

  test('get tx metadata (with checkMetadataHash extension)', async () => {
    const resp = await axios.post('http://127.0.0.1:3001/transaction/metadata', {
      txBlob:
        '00001c0c591bd5a5f69ae815f6aae85433bf5ef7e703cbb9c8b64bc69731252d4c0121710f001a0000006408de7737c59c238890533af25896a2c20608d8b380bb01029acb392781063eacb0ce6e825b73b46536726994c63f4684fd8a72976e07f551de5954f0df5cb501b6648e3f302d557ff1ee5e6d2462f2c668b1c4ac92db6a05c6ab857372c10a13',
      chain: { id: 'roc' },
    })

    expect(resp.status).toBe(200)
    expect(resp.data.txMetadata).toBe(
      '0x60082873705f72756e74696d65384d756c74695369676e6174757265011c4564323535313904001651010148656432353531393a3a5369676e6174757265007d02082873705f72756e74696d65384d756c74695369676e6174757265011c5372323535313904001651010148737232353531393a3a5369676e6174757265047d02082873705f72756e74696d65384d756c74695369676e617475726501144563647361040016b901014065636473613a3a5369676e6174757265087d0204184f7074696f6e0110536f6d650400160400047d0510306672616d655f73797374656d28657874656e73696f6e733c636865636b5f6d6f7274616c69747938436865636b4d6f7274616c697479000400168505010c4572618105102873705f72756e74696d651c67656e657269630c6572610c45726101244d6f7274616c32333204000300a103850510306672616d655f73797374656d28657874656e73696f6e732c636865636b5f6e6f6e636528436865636b4e6f6e6365000400110120543a3a4e6f6e63658905086870616c6c65745f7472616e73616374696f6e5f7061796d656e74604368617267655472616e73616374696f6e5061796d656e7400040013013042616c616e63654f663c543e8d0508746672616d655f6d657461646174615f686173685f657874656e73696f6e44436865636b4d6574616461746148617368000401106d6f646516950501104d6f6465910508746672616d655f6d657461646174615f686173685f657874656e73696f6e104d6f6465011c456e61626c6564000495050c1c73705f636f72651863727970746f2c4163636f756e7449643332000400160401205b75383b2033325d000003200000000304083c7072696d69746976655f74797065731048323536000400160401205b75383b2033325d0c0002031000031400000003480838726f636f636f5f72756e74696d652c52756e74696d6543616c6c011853797374656d040016b801ad0173656c663a3a73705f6170695f68696464656e5f696e636c756465735f636f6e7374727563745f72756e74696d653a3a68696464656e5f696e636c7564653a3a64697370617463680a3a3a43616c6c61626c6543616c6c466f723c53797374656d2c2052756e74696d653e00b40c306672616d655f73797374656d1870616c6c65741043616c6c011872656d61726b04011872656d61726b1610011c5665633c75383e00b80c2873705f72756e74696d65306d756c746961646472657373304d756c746941646472657373010849640400160001244163636f756e74496400f40c2873705f72756e74696d65306d756c746961646472657373304d756c7469416464726573730114496e64657804001501304163636f756e74496e64657804f40c2873705f72756e74696d65306d756c746961646472657373304d756c746941646472657373010c52617704001610011c5665633c75383e08f40c2873705f72756e74696d65306d756c746961646472657373304d756c74694164647265737301244164647265737333320400160401205b75383b2033325d0cf40c2873705f72756e74696d65306d756c746961646472657373304d756c74694164647265737301244164647265737332300400164801205b75383b2032305d10f400034000000003510100034100000003b901604e0800004f080000500800007c0b00007d0b0000660c00007e0c00007f0c0000800c0000820c00004106000042060000440600004506000074060000dd06000013070000340700003507000036070000370700003807000061070000d2070000190140d0e3a60bc0081c3b128f4b59f4f36fce637964ac88a483f393bc347e2cf2c9174d252347d44fbc336e54f775a9e18c94d8c5507a1741847c63c84b07b86ffcd15d59e300e37db1df68c58e25ccb5844c1e99f92556e5350e43a895e8a68aee177048829573d3be7fc180e3d1fcf89c9d216c557a5b6bed233683beb09031b29150addfdb7871ab3b8fe1617989d79cadbfbf4a18395ff6e36a47f33e7d5ea6ccae4df8cef4f7821789308d933604783168eaee9227abcbb71291f021463ff8350620514c4ac1c507900658e0974ea6253d25bd68e47d182b76bde0ba5f382a5b11f96580db6ea22014eda642584eb0a4b0a6c7729e644090ebbca3d9e706b7bc570e356ff73a3d14b6b31b6d479203cca4160faec678752c979cdf4444b2a9be46fb78654a4e119b627f9f517abff7861a14c416dde066cbb68579b84703fe92571f619e44c3b353e28e5767a9a2482218d217aec38a7d61ab73d658b1903f373095fc9ed721398289614edcab0df4975a1c8988623627f2b32e20442f1bad0054ba3a771a8701fa371677c99b9c0f838860ebf95e570ca9aeb980bce22ed9b5e004e784bd9adfca689b8e040a7ea58f58e4cf11c911ff258406adc598eb92bf50fe9f3c9c6af53edeb65176e68f3bdcb342e1a12a1a1a17b399057f8aeace1232dbe32821bd170c9687d0fdb8637e2ec73ac4d686aa236354d3399f3891d0257bc89a651b38ff85a00d86b455e5d6f8340e39cd7c7203c6f64e0bd430c0c57402ccfc40453e184b40bc86238306bc7ef4ebfec645eba8150d145503ddf731d53cfe4773394253ec3028b90910f933fe0e2bc89c094c28f1feba529cc046a1eee431a357fd9d413486fcaac0b1dc1ad93e344c827dee672e7d625e8da68ced657ff32497496d9d8d2984ea17ca635f6bcd30a0a022b77812ad3cd9e9684fd2fb7ffb10abea99b90962543faf81f4a4edfba7170e40dbf4752d2c0a26b762d60063f2e057b5db9c5791a00f8ae71467312b23064f631610c0af61b6535a73627cccec74aaa0e6bae25152af353736d745d2ffd4a90300e5e0ccfc3e48513df17f4a166fa95e272d056e7b9ee34fc014659b78e556c08466a121ca51a1730a41d713c5c3a56150055ef5df6936278bcd2f2c1526b4fe2672081e9fa3855a7a4d4b37ef316484d3d68500069926a66f8bc3d5f7e9a6fb271bfaaede8c0586ccfb170f99725cd1d47353400e367226cbbacf496df57cb668a35ef49de2a0015a6792a1d308d14a716c2393950d511e81f494c45080dc60234dcb225cae83ad5362fc70eac3a7bf12ece613164b86c22092c338e2f46406981ef7e6e51117b3de0b167f5a3f4723d3f7b3ea9a91fdce7474f4c06b452187cbe6bcc979118064e3d7d3814e151905ab6499c76ccb290d3cc9fa2f41bd00139140b7206e31ff9d98e4beef1d1a2e20bbc4a225773b9327590503729e589420b1a75d86eaabff22d7ce5d76d4656a74fa3e343ab4eb80d4212ff1e2099a42a828e49fae58e998245b09f1762cc8cef24c9dad98cef6946d17995bd30d13874e2942aab84a3a47c6abb4a93386d54893394185dd13c4dc6301f5c4a992d5c9e7bee268f970a9baccbdba990ed7f6d6300d9551d6c94639e67c725763a6f9d002d22c64b512fc0d2d6c3deab95bc432f3d69dc8b760f5615e3551d8dce671aab940fc9710ca415c35b7ea5b8797a42a22e9b91367aff359a80f0a9ce7163f16bd16804ee1e77f499eb932b6642b0a3cdb36e79afda7284e33aa4d7ee5c22b919c407e9911bc7d17ebdf98016d3d76a0de1dd9ba084205e532a7bcc815b559fd4f6176666c1383cbb5321e74768150f87c87e2fd113e0c8afbe2d9e10535987ed0a892ec34ff3b9fbee51d26d63065f4d033cd95377f7bdac439761952c119d7ac62d680095793642afe1dd2199b5cfbf04baeef748e3cf3e218c74cd5fdc328f7232eafc1fb2323eb5f39ca313a16a211bac0a412d4ed760f4774900f7852ebc8058bc020d798c9676950fae50f38fc0830938fa49fcabbb1a2e58a39e1bfdfa562f3e1cf8ba9dc8b59bbc3ee1c3794207da0275fb7e1ab8d1cccb116f2b4144040a31e024c7bdfdb877f02ac948c635c12f4c4370a75b7b3ea1a2e88f4ecd197d20d925eddd906079dffaf4214880731bea800e9054beb608043183ac9604567c4492eac0a5671311c3bd8629b760909753f716c72cf7d07cd2c9da0b0921f12488d3d91f9967e8cba23839d273f3f80dec3605f992502bd6ce26099ca2913763cc6019a3d70ce3100bd76244c3b0f6683bebe8d6c0a31bec1f959b686581ad3576393aa332166672cb5209a56be52c56699e9faf9429758f3cf4b098d9b84a84730df91cb86c0e329da73f7d95ee4974fc3904962541c29c55a213c489b1142b89ef72c09e7a13d54d26a15a9791304aca23cd430582e763810732c60f347720ddafdc520e2131da0cdd73227c73cc0edbb6c6df1519578e0803bfa9227acc39ea1e7292f43787e59957612f1074191beb6555447ab77d6621c6c860cb7301e724b7bce8293bfe7fddfc0464670ccf37116fb274f8393cbf36cfd9077be17661356f2ae8b8062d857000fb9ef0ce72b296004cb951440515066cbd5dcda894e7755cedc61dc0a2a7e2854929e8eeea77d6200f6575e9771d01933e1ab656c9b5c4bedd854a542017616a6fe9b8ef6a18a7db05ddf49c69c385da5a1b06575395d3eeb5c038ea7dcb554dc73a53d33593aa48ba429b1709f9c6fe90b901954f4bf7a353b41600f501a31ef1689cf320e884672ae2ad7e11f02f7aa4bd473876dbca1a855bb65755d0c7afacfe3947cb5963dc1a5ca1525c89d0b9e52b00286d2a971f6c3d87f97eb13ae4061804568b0873e96e4d989489363e1474cb3dac4239c764dc0788095558229be044883a7f0521b6a5255cdfb68f5e6417f96490ef06ba2a77cded47bbd9367c9f2758c92c42949fb632a6c39cf7f60f521940d5676e732b1df216515b235e6bab1f276134f07264cb2743b938cca1138c1ca7d2696ce3468f26238480bac732b67f1237425d479b7a4124e07a09629e2bc9c5f841bb54c8f22f30f52e7ff39061fb7780ea6d43e65db1c9451b6555069a9c3c9ba3639004dfb6e5a7f4cac8f0416f416b4167d022448436865636b4e6f6e5a65726f53656e646572151540436865636b5370656356657273696f6e150538436865636b547856657273696f6e150530436865636b47656e6573697315160c38436865636b4d6f7274616c697479168105160c28436865636b4e6f6e6365168905152c436865636b5765696768741515604368617267655472616e73616374696f6e5061796d656e74168d051544436865636b4d6574616461746148617368169105167d0521710f0018726f636f636f2a000c0c524f43',
    )
  })

  test('flush chain metadata', async () => {
    const resp = await axios.post('http://127.0.0.1:3001/node/metadata/flush', { id: 'dot' })
    expect(resp.status).toBe(200)
  })
})
