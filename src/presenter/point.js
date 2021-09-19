import TripPointEditView from '../view/trip-point-edit';
import TripEventsView from '../view/trip-point';
import { UserAction, UpdateType } from '../const';
import { remove, render, RenderPosition, replace} from './../utils/render';
import {isOnline} from '../utils/common';
import {toast} from '../utils/toast';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
};

export default class Point {
  constructor(eventListContainer, changeData, changeMode, destinationsModel, offersModel) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handlerEditClick = this._handlerEditClick.bind(this);
    this._handlerCardClick = this._handlerCardClick.bind(this);
    this._handlerFormSubmit = this._handlerFormSubmit.bind(this);
    this._handlerDeleteClick = this._handlerDeleteClick.bind(this);
    this._handlerFavoriteClick = this._handlerFavoriteClick.bind(this);
    this._onEscKeyHandler = this._onEscKeyHandler.bind(this);
  }

  init(event) {
    this._point = event;

    const prevPointComponent = this._pointComponent;
    const prevEditComponent = this._pointEditComponent;

    this._pointComponent = new TripEventsView(event);
    this._pointEditComponent = new TripPointEditView(event, this._destinationsModel, this._offersModel);

    this._pointComponent.setClickHandler(this._handlerEditClick);
    this._pointComponent.setFavoriteClickHandler(this._handlerFavoriteClick);
    this._pointEditComponent.setClickHandler(this._handlerCardClick);
    this._pointEditComponent.setFormSubmitHandler(this._handlerFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handlerDeleteClick);

    if (prevPointComponent === null || prevEditComponent === null) {
      render(this._eventListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointComponent, prevEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevEditComponent);
  }

  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._pointEditComponent.shake(resetFormState);
        break;
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _replaceCardToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener('keydown', this._onEscKeyHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener('keydown', this._onEscKeyHandler);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._pointEditComponent.reset(this._point);
      this._replaceFormToCard();
    }
  }

  _handlerFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }

  _handlerEditClick() {
    if (!isOnline()) {
      toast('You can\'t edit point offline');
      return;
    }

    this._replaceCardToForm();
  }

  _handlerCardClick() {
    this._pointEditComponent.reset(this._point);
    this._replaceFormToCard();
  }

  _handlerFormSubmit(point) {
    if (!isOnline()) {
      toast('You can\'t save point offline');
      return;
    }

    const isMinorUpdate =
      this._point.price !== point.price ||
      this._point.date !== point.date ||
      this._point.offer !== point.offer;

    this._changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      point,
    );
  }

  _handlerDeleteClick(point) {
    if (!isOnline()) {
      toast('You can\'t delete point offline');
      return;
    }

    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }
}
