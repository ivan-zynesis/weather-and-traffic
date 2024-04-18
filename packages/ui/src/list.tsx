import MuiList from "@mui/material/List";
import MuiListItem from "@mui/material/ListItem";
import "react";

interface ListProps<D> {
  // list element
  className?: string;
  // "Empty list" and "Loading" text className
  statusTextClassName?: string;
  // eslint-disable-next-line no-unused-vars
  renderRow(data: D, index: number): React.ReactElement;

  // query state
  state: "LOADING" | "LOADED" | "ERROR";
  data: D[];
}

export const List = <D,>({
  state,
  className,
  statusTextClassName,
  data,
  renderRow,
}: ListProps<D>) => {
  return (
    <MuiList className={className}>
      {state === "LOADING" ? (
        <span className={statusTextClassName}>Loading ...</span>
      ) : state === "ERROR" ? (
        <span className={statusTextClassName}>Error</span>
      ) : data.length === 0 ? (
        <span className={statusTextClassName}>List is empty</span>
      ) : (
        data.map((d, index) => <MuiListItem>{renderRow(d, index)}</MuiListItem>)
      )}
    </MuiList>
  );
};
