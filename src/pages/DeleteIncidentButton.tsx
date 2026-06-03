import React from "react";
import { useMutation } from "@apollo/client/react";
import { DELETE_INCIDENT_MUTATION } from "../graphql/mutations";
import { GET_INCIDENTS_QUERY } from "../graphql/queries";

interface Props {
  incidentId: string;
}

const DeleteIncidentButton: React.FC<Props> = ({
  incidentId,
}) => {
  const [deleteIncident, { loading }] = useMutation(
    DELETE_INCIDENT_MUTATION,
    {
      refetchQueries: [GET_INCIDENTS_QUERY],
    }
  );

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this incident?"
    );

    if (!confirmed) return;

    try {
      const { data } = await deleteIncident({
        variables: {
          id: incidentId,
        },
      });

      alert(data.deleteIncident);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
};

export default DeleteIncidentButton;