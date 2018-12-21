<template>
        <div class="font-sans text-base container mx-auto mt-10">
            <div class="max-w-sm rounded-lg overflow-hidden shadow mx-auto bg-white">
                <div class="p-6 pb-0">
                    <p class="text-grey-darker text-base">
                        <!-- <a href="#" class="close float-right"><i class="fa fa-times"></i></a> -->

                        <div class="mb-6 buttons flex">
                            <button
                                @click="changeMethod('address')"
                                :class="{ blue: method === 'address', grey: method === 'qrcode' }"
                                class="tab p-3 text-sm rounded-tl rounded-bl">Address</button>

                            <button
                                @click="changeMethod('qrcode')"
                                :class="{ blue: method === 'qrcode', grey: method === 'address' }"
                                class="tab p-3 text-sm rounded-tr rounded-br">QR-Code</button>
                        </div>

                        <div v-if="method === 'address'">
                            <div class="mt-3 pb-3 border-b-2 border-dashed">
                                <small class="block mb-2">Product</small>
                                <span class="font-bold">
                                    Surprise GIF
                                </span>
                            </div>

                            <div class="mt-3 pb-3 border-b-2 border-dashed">
                                <small class="block mb-2">ARK Address</small>
                                <span class="font-bold">
                                    {{ recipient }}
                                    <span class="clipboard float-right animated" @click="animateCopy">
                                        <img v-clipboard="recipient" src="images/clipboard.png">
                                    </span>
                                </span>
                            </div>

                            <div class="mt-3 pb-3 border-b-2 border-dashed">
                                <small class="block mb-2">Vendor Field</small>
                                <span class="font-bold">
                                    {{ vendorField }}
                                    <span class="clipboard float-right animated" @click="animateCopy">
                                        <img v-clipboard="vendorField" src="images/clipboard.png">
                                    </span>
                                </span>
                            </div>

                            <div class="mt-3 pb-3 border-b-2 border-dashed" v-if="amountCrypto">
                                <small class="block mb-2">Amount</small>
                                <span class="font-bold block pt-1">
                                    <span class="currency font-hairline rounded text-sm mr-2 px-2 py-1">DѦ</span>
                                    {{ amountCrypto }}
                                    <span class="fiat font-normal">/ ${{ amount }}</span>
                                    <span class="clipboard float-right animated" @click="animateCopy">
                                        <img v-clipboard="amountCrypto" src="images/clipboard.png">
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div v-if="method === 'qrcode'" class="text-center">
                            <a :href="scanLink">
                                <qrcode :value="scanLink" :options="{ size: 256, padding: 0 }"></qrcode>
                            </a>
                        </div>
                    </p>
                </div>

                <div class="p-6" v-if="!hasPaid">
                    <div class="flex flex-no-wrap">
                        <div class="w-3/4 flex-none">
                            <small class="block mb-2">Time to pay:</small>
                            <img src="images/time.png" class="time inline-block">
                            <span class="inline-block pl-3">
                                <span class="font-bold block">{{ countdownLabel }}</span>
                                <span><span class="waiting text-sm font-light">Waiting for transaction confirmation ...</span></span>
                            </span>
                        </div>
                        <div class="w-1/4 flex-none pt-6">
                            <a :href="scanLink" class="pay-button text-sm font-bold p-3 no-underline rounded float-right">Pay Now</a>
                        </div>
                    </div>
                </div>

                <div class="p-6" v-if="hasPaid">
                    <img :src="product" />
                </div>
            </div>
        </div>
</template>

<script>
    import ArkPay from '@arkecosystem/pay'
    import { sample } from 'lodash'
    import uuid from 'uuid/v1'

    export default {
        data() {
            return {
                method: 'address',
                hasPaid: false,
                recipient: 'DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9',
                amount: 1,
                amountCrypto: null,
                vendorField: uuid(),
                product: null,
                products: [
                    'https://media.giphy.com/media/psNbEEYu2wqC4/giphy.gif',
                    'https://media.giphy.com/media/x33p3SDzDM1ji/giphy.gif',
                    'https://media.tenor.com/images/10dddb94d13f79929e5a7f02ac5d6cf4/tenor.gif',
                    'https://media.tenor.com/images/622bd31b20c5022cc8d911276db83383/tenor.gif',
                    'https://media.tenor.com/images/6299dd92d2cdd27ef5109915736f562b/tenor.gif',
                    'https://media.tenor.com/images/96de0a76005b3c4943971457c25d40bf/tenor.gif',
                    'https://media.tenor.com/images/b60a4c3b8416491278d67af5a0a6d6be/tenor.gif',
                    'https://media.tenor.com/images/bd523044b2f3522a97af519eeccc6c47/tenor.gif',
                    'https://media.tenor.com/images/c1aeae21af63e012ae4fa224c5be5f7c/tenor.gif',
                    'https://media.tenor.com/images/edbcf3c9d2a2055c5f2176ceaad99156/tenor.gif',
                    'https://media0.giphy.com/media/j1QQj6To9Pbxu/giphy.gif?cid=3640f6095c1b8d405542324563bce467',
                    'https://media1.tenor.com/images/21feb0104626e77b01544ec9e2998c0e/tenor.gif?itemid=3580665',
                    'https://media1.tenor.com/images/727cf3a6ec2e9a337248926db3c93cce/tenor.gif?itemid=7317444',
                    'https://media1.tenor.com/images/7355b9adf82b717e2af222303438b204/tenor.gif?itemid=7322073',
                    'https://media2.giphy.com/media/HGETmieaLgcxy/giphy.gif?cid=3640f6095c1b9bcd6f4a757167497f51',
                    'https://media3.giphy.com/media/p1hRAmsUMaSmA/giphy.gif?cid=3640f6095c1b96d23262756f45616981',
                ],
                timeLeft: 0,
                timeMinutes: 0,
                timeSeconds: 0,
                intervalMinutes: 5,
                waitingTimer: null,
            }
        },
        computed: {
            countdownLabel: function () {
                const seconds = this.timeSeconds.toLocaleString('en-US', {
                    minimumIntegerDigits: 2,
                    useGrouping: false
                })

                return `${this.timeMinutes}:${seconds}`
            },
            scanLink: function () {
                return `ark:${this.recipient}?amount=${this.amountCrypto}&vendorField=${this.vendorField}`
            }
        },
        mounted() {
            this.setup()
        },
        methods: {
            async setup () {
                const gateway = new ArkPay()
                gateway
                    .recipient(this.recipient)
                    .amount(this.amount)
                    .vendorField(this.vendorField)
                    .currency('USD')
                    .coin('ARK')
                    .network('devnet')

                gateway.on('started', data => {
                    this.amountCrypto = data.transfer.amounts.crypto
                })

                gateway.on('completed', data => {
                    this.hasPaid = true
                    this.product = sample(this.products)
                })

                gateway.peers([{
                    ip: 'dexplorer.ark.io',
                    port: 8443,
                    protocol: 'https',
                }])

                await gateway.start()

                this.countdown()
            },
            countdown() {
                this.timeLeft = this.intervalMinutes * 60

                const calculate = () => {
                  if (this.hasPaid) {
                    clearInterval(this.waitingTimer)

                    return
                  }

                  if (this.timeLeft <= 0) {
                    clearInterval(this.waitingTimer)

                    alert('We have not received any payment so far. Try again.')

                    window.location.reload()

                    return
                  }

                  this.timeLeft -= 1
                  this.timeMinutes = Math.floor(this.timeLeft / 60)
                  this.timeSeconds = this.timeLeft - this.timeMinutes * 60
                }

                this.waitingTimer = setInterval(calculate.bind(this), 1000)
            },
            changeMethod(method) {
                this.method = method
            },
            animateCopy(e) {
                const element = e.target.parentElement

                if (!element.classList.contains('bounce')) {
                    element.classList.add('bounce')
                }

                setTimeout(() => { element.classList.remove('bounce') }, 1000)
            }
        }
    }
</script>
