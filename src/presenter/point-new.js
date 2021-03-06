import TripPointEditView from '../view/trip-point-edit';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';
import {isEscape} from '../utils/common';

export default class PointNew {
  constructor(tripListContainer, changeData, changeBtnStatus, destinationsModel, offersModel) {
    this._tripListContainer = tripListContainer;
    this._changeData = changeData;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._changeBtnStatus = changeBtnStatus;

    this._tripEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._tripEditComponent !== null) {
      return;
    }

    this._tripEditComponent = new TripPointEditView(undefined, this._destinationsModel, this._offersModel);
    this._tripEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._tripListContainer, this._tripEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._tripEditComponent === null) {
      return;
    }

    remove(this._tripEditComponent);
    this._tripEditComponent = null;

    this._changeBtnStatus();

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  setSaving() {
    this._tripEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._tripEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._tripEditComponent.shake(resetFormState);
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point,
    );

  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (isEscape(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
