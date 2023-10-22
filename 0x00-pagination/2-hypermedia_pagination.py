#!/usr/bin/env python3
"""
Module with a single fun: index_range function and Server class
"""
import csv
import math
from typing import List
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """function returns a tuple of size two containing a start index and an
    end index corresponding to the range of indexes to return in a list
    for those particular pagination parameters"""
    start_index = (page - 1) * page_size
    end_index = (start_index + page_size)

    return (start_index, end_index)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Uses the index_range to find the correct indexes to paginate
        the dataset correctly and return the appropriate page of the
        dataset """
        assert (page > 0 and type(page) is int)
        assert (page_size > 0 and type(page_size) is int)

        tup_ind = index_range(page, page_size)

        data_file = self.dataset()
        try:
            return data_file[tup_ind[0]:tup_ind[1]]
        except IndexError:
            return []

    def get_hyper(self, page: int = 1, page_size: int = 10) -> dict:
        """returns a dictionary containing the following key-value pairs
        page_size, page, data, next_page, prev_page, total_pages are the keys"""
        get_data = self.get_page(page, page_size)
        total_pages = len(self.dataset()) // (page_size)

        get_dict = {
            "page": page,
            "page_size": page_size,
            "data": get_data,
            "next_page": page + 1 if page + 1 <= total_pages else None,
            "prev_page": page - 1 if page > 1 else None,
            "total_pages": total_pages
        }

        return get_dict
