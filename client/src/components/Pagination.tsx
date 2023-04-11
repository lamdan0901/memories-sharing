import {
  Pagination as MUIPagination,
  PaginationItem,
  Button,
} from "@mui/material";

interface PaginationProps {
  count?: number;
  page: number;
  onPageChange: (toPage?: string) => void;
}

function Pagination({ count = 5, page, onPageChange }: PaginationProps) {
  return (
    <MUIPagination
      sx={{ mt: 3, mx: "auto" }}
      count={count}
      page={page}
      variant="outlined"
      color="primary"
      shape="rounded"
      renderItem={(item) => (
        <PaginationItem
          {...item}
          component={Button}
          onClick={() => onPageChange(item.page + "")}
        />
      )}
    />
  );
}

export default Pagination;
