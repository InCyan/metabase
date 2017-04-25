/* @flow */

import React, {Component} from 'react';
import {connect} from "react-redux";
import cx from "classnames";
import _ from "underscore"

import type {Dashboard} from "metabase/meta/types/Dashboard";

import DashboardList from "../components/DashboardList";

import TitleAndDescription from "metabase/components/TitleAndDescription";
import CreateDashboardModal from "metabase/components/CreateDashboardModal";
import Modal from "metabase/components/Modal.jsx";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";
import Icon from "metabase/components/Icon.jsx";
import SearchHeader from "metabase/components/SearchHeader";
import EmptyState from "metabase/components/EmptyState";
import ListFilterWidget from "metabase/components/ListFilterWidget";
import type {ListFilterWidgetItem} from "metabase/components/ListFilterWidget";

import {caseInsensitiveSearch} from "metabase/lib/string"

import * as dashboardsActions from "../dashboards";
import {getDashboardListing} from "../selectors";
import {getUser} from "metabase/selectors/user";

const mapStateToProps = (state, props) => ({
    dashboards: getDashboardListing(state),
    user: getUser(state)
});

const mapDispatchToProps = dashboardsActions;

const SECTION_ID_ALL = 'all';
const SECTION_ID_MINE = 'mine';
const SECTION_ID_FAVORITES = 'fav';

const SECTIONS: ListFilterWidgetItem[] = [
    {
        id: SECTION_ID_ALL,
        name: 'All dashboards',
        icon: 'all',
        // empty: 'No questions have been saved yet.',
    },
    {
        id: SECTION_ID_FAVORITES,
        name: 'Favorites',
        icon: 'star',
        // empty: 'You haven\'t favorited any questions yet.',
    },
    // {
    //     id: 'recent',
    //     name: 'Recently viewed',
    //     icon: 'recents',
    //     // empty: 'You haven\'t viewed any questions recently.',
    // },
    {
        id: SECTION_ID_MINE,
        name: 'Saved by me',
        icon: 'mine',
        // empty:  'You haven\'t saved any questions yet.'
    },
    // {
    //     id: 'popular',
    //     name: 'Most popular',
    //     icon: 'popular',
    //     // empty: 'The most viewed questions across your company will show up here.',
    // }
];

export class Dashboards extends Component {
    props: {
        dashboards: Dashboard[],
        createDashboard: (Dashboard) => any,
        fetchDashboards: () => void,
        setFavorited: (dashboardId: number, favorited: boolean) => void
    };

    state = {
        modalOpen: false,
        searchText: "",
        section: SECTIONS[0]
    }

    componentWillMount() {
        this.props.fetchDashboards();
    }

    async onCreateDashboard(newDashboard: Dashboard) {
        let {createDashboard} = this.props;

        try {
            await createDashboard(newDashboard, {redirect: true});
        } catch (e) {
            console.log("createDashboard failed", e);
        }
    }

    showCreateDashboard = () => {
        this.setState({modalOpen: !this.state.modalOpen});
    }

    hideCreateDashboard = () => {
        this.setState({modalOpen: false});
    }

    renderCreateDashboardModal() {
        return (
            <Modal>
                <CreateDashboardModal
                    createDashboardFn={this.onCreateDashboard.bind(this)}
                    onClose={this.hideCreateDashboard}/>
            </Modal>
        );
    }

    /* Returns a boolean indicating whether the search term was found from dashboard name or description */
    searchTextFilter = (searchText: string) =>
        ({name, description}: Dashboard) =>
            (caseInsensitiveSearch(name, searchText) || (description && caseInsensitiveSearch(description, searchText)))

    /* Returns a boolean indicating whether the dashboard belongs to the specified section or not */
    sectionFilter = (section: ListFilterWidgetItem) =>
        ({creator_id, favorite}: Dashboard) =>
            (section.id === SECTION_ID_ALL) ||
            (section.id === SECTION_ID_MINE && creator_id === this.props.user.id) ||
            (section.id === SECTION_ID_FAVORITES && favorite === true)

    getFilteredDashboards = () => {
        const {searchText, section} = this.state;
        const {dashboards} = this.props;
        const noOpFilter = _.constant(true)

        return _.chain(dashboards)
            .filter(searchText != "" ? this.searchTextFilter(searchText) : noOpFilter)
            .filter(this.sectionFilter(section))
            .value()
    }

    updateSection = (section: ListFilterWidgetItem) => {
        this.setState({section});
    }

    render() {
        let {modalOpen, searchText, section} = this.state;

        const isLoading = this.props.dashboards === null
        const noDashboardsCreated = this.props.dashboards && this.props.dashboards.length === 0
        const filteredDashboards = isLoading ? [] : this.getFilteredDashboards();
        const noSearchResults = searchText !== "" && filteredDashboards.length === 0;

        return (
            <LoadingAndErrorWrapper
                loading={isLoading}
                className={cx("relative mx4", {"flex-full flex align-center justify-center": noDashboardsCreated})}
            >
                { modalOpen ? this.renderCreateDashboardModal() : null }
                { noDashboardsCreated ?
                    <div className="mt2">
                        <EmptyState
                            message={<span>Put the charts and graphs you look at <br/>frequently in a single, handy place.</span>}
                            image="/app/img/dashboard_illustration"
                            action="Create a dashboard"
                            onActionClick={this.showCreateDashboard}
                            className="mt2"
                            imageClassName="mln2"
                        />
                    </div>
                    : <div>
                        <div className="flex align-center pt4 pb1">
                            <TitleAndDescription title="Dashboards"/>
                            <div className="flex-align-right cursor-pointer text-grey-5 text-brand-hover">
                                <Icon name="add"
                                      size={20}
                                      onClick={this.showCreateDashboard}/>
                            </div>
                        </div>
                        <div className="flex align-center pb1">
                            <SearchHeader
                                searchText={searchText}
                                setSearchText={(text) => this.setState({searchText: text})}
                            />
                            <div className="flex-align-right">
                                <ListFilterWidget
                                    items={SECTIONS.filter(item => item.id !== "archived")}
                                    activeItem={section}
                                    onChange={this.updateSection}
                                />
                            </div>
                        </div>
                        { noSearchResults ?
                            <div className="flex justify-center">
                                <EmptyState
                                    message={
                                        <div className="mt4">
                                            <h3 className="text-grey-5">No results found</h3>
                                            <p className="text-grey-4">Try adjusting your filter to find what you’re
                                                looking for.</p>
                                        </div>
                                    }
                                    image="/app/img/empty_dashboard"
                                    action="Create a dashboard"
                                    imageClassName="mln2"
                                    smallDescription
                                />
                            </div>
                            : <DashboardList dashboards={filteredDashboards} setFavorited={this.props.setFavorited} />
                        }
                    </div>

                }
            </LoadingAndErrorWrapper>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboards)
