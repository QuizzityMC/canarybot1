import { EmbedBuilder, Message } from "discord.js";
import BaseClient from "../lib/BaseClient";
import BaseCommand, { CommandPermissionLevel } from "../lib/BaseCommand";

export default class extends BaseCommand {
    constructor(public readonly client: BaseClient) {
        super({
            name: "unlockchannel",
            description: "Unlocks the current channel.",
            aliases: ["ulc", "unlockc", "unlock", "unlockchan"],
            guildOnly: true,
            permissionLevel: CommandPermissionLevel.Moderator,
        });
    }
    public async execute(msg: Message, args: string[]): Promise<any> {
        const channelId = args.length ? args[0] : msg.channel.id;
        const channel = msg.guild?.channels.cache.get(channelId);
        if (!channel || !("permissionOverwrites" in channel)) return await msg.channel.send("Invalid channel.");

        const perms = channel.permissionOverwrites.cache.get(msg.guild!.id);
        if (!perms) return await msg.channel.send("Couldn't get permission overwrites for channel.");
        if (perms.allow.has("SendMessages")) {
            const embed = new EmbedBuilder()
                .setDescription(`🤔 Channel is not locked`)
                .setColor("Red")
                .setTimestamp()
                .setFooter({
                    text: msg.author.tag,
                    iconURL: msg.author.displayAvatarURL(),
                });
            return await msg.channel.send({
                embeds: [embed],
            });
        }
        await channel.permissionOverwrites.edit(msg.guild!.roles.everyone, { SendMessages: true });

        const embed = new EmbedBuilder()
            .setDescription(`🔓 Unlocked channel <#${channel.id}>`)
            .setColor("Red")
            .setTimestamp()
            .setFooter({
                text: msg.author.tag,
                iconURL: msg.author.displayAvatarURL(),
            });
        return await msg.channel.send({
            embeds: [embed],
        });
    }
}
