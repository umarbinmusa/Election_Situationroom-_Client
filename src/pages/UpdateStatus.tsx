import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_INCIDENT_STATUS_MUTATION } from "../graphql/mutations";
import { GET_INCIDENTS_QUERY } from "../graphql/queries";

interface Props {
  incidentId: string;
  currentStatus: string;
}

const UpdateStatus: React.FC<Props> = ({
  incidentId,
  currentStatus,
}) => {
  const [status, setStatus] =
    useState(currentStatus);

  const [updateStatus, { loading }] =
    useMutation(
      UPDATE_INCIDENT_STATUS_MUTATION,
      {
        refetchQueries: [GET_INCIDENTS_QUERY],
      }
    );

  const handleUpdate = async () => {
    try {
      await updateStatus({
        variables: {
          id: incidentId,
          status,
        },
      });

      alert(
        "Incident status updated successfully"
      );
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <select
        value={status}
        onChange={(e) =>
          setStatus(e.target.value)
        }
        className="border rounded-lg px-3 py-2"
      >
        <option value="PENDING">
          PENDING
        </option>
        <option value="VERIFIED">
          VERIFIED
        </option>
        <option value="RESOLVED">
          RESOLVED
        </option>
      </select>

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        {loading
          ? "Updating..."
          : "Update"}
      </button>
    </div>
  );
};

export default UpdateStatus;