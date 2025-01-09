import "./search.scss";
import { useLoaderData, useParams, withRouter } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import {useState, useContext} from "react";
import HandleUserInfo from "../../apiFunctions/HandleUserInfo";
import AuthContext from "../../authentication/AuthContext";
import placeholder from "../../assets/placeholder.jpg";
import React from "react";
import {liteClient as algoliasearch} from 'algoliasearch/lite';
import {
    InstantSearch,
    SearchBox,
    Hits,
    Highlight,
    Pagination,
    Configure,
    Index,
} from "react-instantsearch-dom";

export default function Search(props) {
    // Initialize Algolia client
    const searchClient = algoliasearch("ADGAUZ8S9H", "6f8d04ee92925557efb7b54e072b8707"); // id and api
    const {searchQuery, setSearchQuery} = useContext(AuthContext);
    const navigate = useNavigate();


    // Define how to display each hit (search result)
    const Hit = ({ hit }) => (
        <div className="search_entity" onClick={() =>handleClick(hit, hit["username"])}>
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
                
        </div>
    );


    const Hit_admin = ({ hit }) => (
        <div className="search_entity" onClick={() =>handleClick(hit, hit["organisation"])}>
            <h2>
                {hit["organisation"]} 
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

    const handleClick = (hit, path) => {
        navigate("/profile/" + path);
    }

    const Display_hit = ()=>{
        if (searchQuery !== ""){
            return <Hits hitComponent={Hit} className="search_entity"/>
        }
        else{
            return <h4>No result</h4>
        }
    }

    const Display_hit_admin = ()=>{
        if (searchQuery !== ""){
            return <Hits hitComponent={Hit_admin} className="search_entity"/>
        }
        else{
            return <h4>No result</h4>
        }
    }


    return( // main return function
        <div className="search_main">
            <InstantSearch indexName="user_name" searchClient={searchClient}>
                <Configure query={searchQuery} />
                <h1>Search result</h1>
                <h2>User search</h2>
                <Display_hit/>

            <Index indexName="organisation_name" >
                    <h2>organiser search</h2>
                    <Display_hit_admin />
                </Index>

                
                {/*<Pagination />*/}
            </InstantSearch>
        </div>
    )

}


