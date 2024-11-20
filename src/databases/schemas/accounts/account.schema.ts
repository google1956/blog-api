import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

//With this option the createdAt and updatedAt properties will be added to the documents of the collection
@Schema({
    timestamps: true,
})
export class Account {
    // @Prop({ type: mongoose.Types.ObjectId })
    _id: ObjectId

    @Prop()
    username: string;

    @Prop()
    full_name: string;

    @Prop()
    first_name: string;

    @Prop()
    last_name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    times: string;

    @Prop()
    email_validate_at: Date

    @Prop()
    email_validate_token: String

    @Prop()
    status: number // 0, 1, 2, 3

    @Prop()
    deleted_at: Date

    @Prop()
    reset_password_token: string

    @Prop()
    request_reset_password_at: Date

}

export const AccountSchema = SchemaFactory.createForClass(Account);

