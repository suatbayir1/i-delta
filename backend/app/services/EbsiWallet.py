import random

class EbsiWallet():
    def __init__(self, privateKey):
        self.privateKey = privateKey

    def createDid(self):
        try:
            randomString = ''.join(random.choice('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz') for _ in range(32))
            return f"did:ebsi:{randomString}"
        except:
            return False

