#!/usr/bin/env python3
"""
LFUCache module Class that inherits from a parent class
"""
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """inherits from BaseCaching and is a caching system"""
    def __init__(self):
        """Init the class bacicache"""
        super().__init__()
        self.listing = []

    def put(self, key, item):
        """assigns to the dictionary self.cache_data the item
        value for the key key"""
        # listing = []
        if key is None or item is None:
            pass
        else:
            if len(self.cache_data.keys()) >= self.MAX_ITEMS:
                print("DISCARD: {}".format(self.listing[0]))
                del (self.cache_data[self.listing[0]])
                del (self.listing[0])

            if key in self.listing:
                self.listing.remove(key)

            # if len(item) > 1 and len(key) > 1:
            # del (self.cache_data[self.listing[-1]])
            # del (self.listing[-1])

            self.listing.append(key)
            self.cache_data[key] = item

    def get(self, key):
        """returns the value in self.cache_data linked to key"""
        if key is None or key not in self.cache_data.keys():
            return None
        else:
            return self.cache_data[key]
