import React from "react";
import { Pagination as MUIPagination, PaginationItem } from "@mui/material";
import { Link } from "react-router-dom";

interface PaginationProps {
  count?: number;
  page: number;
}

function Pagination({ count = 10, page }: PaginationProps) {
  return (
    <MUIPagination
      count={count}
      page={page}
      variant="outlined"
      color="primary"
      renderItem={(item) => (
        <PaginationItem {...item} component={Link} to={`/posts?page=${page}`} />
      )}
    />
  );
}

export default Pagination;
