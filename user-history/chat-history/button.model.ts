export class Button {
  constructor(
    public type: string,
    public payload: string,
    public value: string,
    public image_url: string,
    public emojified_payload?: string
  ) {}
}