import "./search.scss";
import { useLoaderData, useParams, withRouter } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom"
import {useState, useContext} from "react";
import HandleUserInfo from "../../apiFunctions/HandleUserInfo";
import AuthContext from "../../authentication/AuthContext";
import placeholder from "../../assets/placeholder.jpg";
import React from "react";
import algoliasearch from 'algoliasearch/lite';
import {
    InstantSearch,
    SearchBox,
    Hits,
    Highlight,
    Pagination,
    Configure
} from "react-instantsearch-dom";

export default function Search(props) {
    // Initialize Algolia client
    const searchClient = algoliasearch("ADGAUZ8S9H", "6f8d04ee92925557efb7b54e072b8707");
    const {searchQuery, setSearchQuery} = useContext(AuthContext);
    const navigate = useNavigate();


    // Define how to display each hit (search result)
    const Hit = ({ hit }) => (
    
    <div className="search_entity" onClick={() =>handleClick(hit)}>
        <h2>
            {hit["username"]} 
        </h2>
        {hit["profile_picture"] ? (
            <img src={hit["profile_picture"]} alt="" className="profile_img" />
        ) : (
            <img src={placeholder} alt="" className="profile_img" />
        )}
        
        <h4>
            {hit["name"]}   
        </h4>
        <p>
            {hit["interests"]}  
        </p>
    </div>
    );

    const handleClick = (hit) => {
        navigate("/profile/" + hit["username"]);
    }

    const Display_hit = ()=>{
        if (searchQuery !== ""){
            return <Hits hitComponent={Hit} className="search_entity"/>
        }
        else{
            return <h4>No result</h4>
        }
    }


    return( // main return function
        <div className="search_main">
        <InstantSearch indexName="user_name" searchClient={searchClient}>
            <Configure query={searchQuery} />
            <h1>Search result with: {searchQuery}</h1>
            <Display_hit/>
            
            {/*<Pagination />*/}
        </InstantSearch>
        </div>
    )

}


