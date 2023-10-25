#!/usr/bin/env python3
"""
BaseCaching module Class that inherits from a parent class
"""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """class that inherits from BaseCaching and is a caching system"""
    def __init__(self):
        """Init the class bacicache"""
        super().__init__()

    def put(self, key, item):
        """assigns to the dictionary self.cache_data the item
        value for the key key"""
        if key is None or item is None:
            pass
        else:
            self.cache_data[key] = item

    def get(self, key):
        """returns the value in self.cache_data linked to key"""
        if key is None or key not in self.cache_data.keys():
            return None
        else:
            return self.cache_data[key]
