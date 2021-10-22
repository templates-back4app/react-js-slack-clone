import React from "react";
import "./App.css";
import { Spin } from "antd";
import Parse from "parse";
import { useParseQuery } from "@parse/react";

export const ChannelList = (props) => {
  // Create parse query for live querying using useParseQuery hook
  // This query is a composite OR one, combining the results of both
  // Note that Parse.Object coming from props need to be changed into pointers
  // to be able to be used by Parse, since React changes the object structure
  // when passing down parameters to child components
  const ownerQuery = new Parse.Query("Channel");
  ownerQuery.equalTo("owner", props.currentUser.toPointer());
  const membersQuery = new Parse.Query("Channel");
  membersQuery.containedIn("members", [props.currentUser.toPointer()]);
  // Creates the OR query
  const parseQuery = Parse.Query.or(ownerQuery, membersQuery);
  // Set results ordering
  parseQuery.ascending("name");
  // Include all pointer fields
  parseQuery.includeAll();

  // Declare hook and variables to hold hook responses
  const { isLoading, results, error } = useParseQuery(parseQuery, {
    enableLocalDatastore: false, // Enables cache in local datastore (default: true)
    enableLiveQuery: true, // Enables live query for real-time update (default: true)
  });

  return (
    <div>
      {isLoading && <Spin />}
      {error && <p>{error.message}</p>}
      {results && (
        <ul>
          {results.length > 0 ? (
            results
              .filter(
                (x) =>
                  x.get("owner").id === props.currentUser.id ||
                  x
                    .get("members")
                    .find((y) => y.id === props.currentUser.id) !== undefined
              )
              .sort((a, b) => a.get("name") - b.get("name"))
              .map((result) => (
                <li
                  className="channel__title"
                  key={result.id}
                  onClick={(_e) => props.selectChannelCallback(result)}
                >{`# ${result.get("name")}`}</li>
              ))
          ) : (
            <ul>
              <li>{"No channels here yet!"}</li>
            </ul>
          )}
        </ul>
      )}
    </div>
  );
};
