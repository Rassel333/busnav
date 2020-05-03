import React from "react";
import { List, ListItem } from "@material-ui/core";
import styles from "./Suggestions.module.css";

export const Suggestions = ({ suggestions, fromValue, toValue, onSelect }) =>
  suggestions.length && (fromValue || toValue) ? (
    <List style={{ color: "#fff" }}>
      {suggestions.map((suggestion, index) => (
        <ListItem
          button
          onClick={() => onSelect(suggestion.value, suggestion.displayName)}
          key={`${suggestion.value}-${index}`}
        >
          {suggestion.displayName}
        </ListItem>
      ))}
    </List>
  ) : (
    <div className={styles.noResults}>Нет подходящих результатов</div>
  );
