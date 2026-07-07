import React from "react";

function Card(props) {

    return (

        <div className={`rounded-xl p-5 h-28 text-white bg-gradient-to-r ${props.color}`}>

            <h3 className="text-sm font-semibold">

                {props.title}

            </h3>

            <h1 className="text-3xl font-bold mt-2">

                {props.value}

            </h1>

            {/* Show only for Threat Score */}

            {props.risk && (

                <p className={`mt-1 text-sm font-bold ${props.threatColor}`}>

                    {props.risk}

                </p>

            )}

        </div>

    );

}

export default Card;